package com.train_seat.api.service;

import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.train_seat.api.dto.seat.AvailableSeatResponse;
import com.train_seat.api.dto.seat.ClassTypeSummary;
import com.train_seat.api.dto.seat.CoachSummary;
import com.train_seat.api.dto.seat.SeatAvailabilityRequest;
import com.train_seat.api.dto.seat.SeatSummary;
import com.train_seat.api.model.Booking;
import com.train_seat.api.model.Coach;
import com.train_seat.api.model.Seat;
import com.train_seat.api.repository.BookingRepository;
import com.train_seat.api.repository.RouteRepository;
import com.train_seat.api.repository.SeatRepository;
import com.train_seat.api.service.JourneyValidation.ValidatedJourney;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SeatService {

	private final RouteRepository routeRepository;
	private final SeatRepository seatRepository;
	private final BookingRepository bookingRepository;

	@Transactional(readOnly = true)
	public List<AvailableSeatResponse> findAvailable(SeatAvailabilityRequest request) {
		ValidatedJourney journey = JourneyValidation.validate(
				routeRepository.findByIdWithTrainAndStops(request.getRouteId()).orElse(null),
				request.getRouteId(),
				request.getFrom(),
				request.getTo(),
				request.getDate());

		Long trainId = journey.route().getTrain().getId();
		int fromSeq = journey.fromStop().getStopSequence();
		int toSeq = journey.toStop().getStopSequence();

		List<Seat> seats = seatRepository.findOnlineBookableByTrainIdWithCoachAndClassType(trainId);
		List<Booking> bookings = bookingRepository.findByTravelDateAndTrainIdWithStops(
				request.getDate(), trainId);

		Set<Long> occupiedSeatIds = new HashSet<>();
		for (Booking booking : bookings) {
			int bookedFrom = booking.getFromStopOrder().getStopSequence();
			int bookedTo = booking.getToStopOrder().getStopSequence();
			if (JourneyValidation.segmentsOverlap(bookedFrom, bookedTo, fromSeq, toSeq)) {
				occupiedSeatIds.add(booking.getSeat().getId());
			}
		}

		return seats.stream()
				.filter(seat -> !occupiedSeatIds.contains(seat.getId()))
				.sorted(Comparator
						.comparing((Seat seat) -> seat.getCoach().getNumber())
						.thenComparing(Seat::getNumber))
				.map(this::toAvailableSeatResponse)
				.toList();
	}

	private AvailableSeatResponse toAvailableSeatResponse(Seat seat) {
		Coach coach = seat.getCoach();
		return new AvailableSeatResponse(
				new SeatSummary(seat.getId(), seat.getNumber()),
				new CoachSummary(coach.getId(), coach.getNumber()),
				new ClassTypeSummary(coach.getClassType().getId(), coach.getClassType().getName()));
	}
}
