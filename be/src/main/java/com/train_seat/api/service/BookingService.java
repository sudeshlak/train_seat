package com.train_seat.api.service;

import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.train_seat.api.dto.booking.BookSeatRequest;
import com.train_seat.api.dto.booking.BookingResponse;
import com.train_seat.api.dto.booking.BookingsResponse;
import com.train_seat.api.dto.route.StationSummary;
import com.train_seat.api.dto.seat.ClassTypeSummary;
import com.train_seat.api.dto.seat.CoachSummary;
import com.train_seat.api.dto.seat.SeatSummary;
import com.train_seat.api.exception.SeatUnavailableException;
import com.train_seat.api.exception.ValidationException;
import com.train_seat.api.model.Booking;
import com.train_seat.api.model.BookingStatus;
import com.train_seat.api.model.Coach;
import com.train_seat.api.model.Fare;
import com.train_seat.api.model.Route;
import com.train_seat.api.model.Seat;
import com.train_seat.api.model.StopOrder;
import com.train_seat.api.model.User;
import com.train_seat.api.repository.BookingRepository;
import com.train_seat.api.repository.FareRepository;
import com.train_seat.api.repository.RouteRepository;
import com.train_seat.api.repository.SeatRepository;
import com.train_seat.api.repository.UserRepository;
import com.train_seat.api.service.JourneyValidation.ValidatedJourney;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookingService {

	private static final String SEAT_UNAVAILABLE = "Seat is no longer available for this journey";

	private final RouteRepository routeRepository;
	private final SeatRepository seatRepository;
	private final BookingRepository bookingRepository;
	private final FareRepository fareRepository;
	private final UserRepository userRepository;

	@Transactional
	public BookingResponse book(BookSeatRequest request, Long userId) {
		ValidatedJourney journey = JourneyValidation.validate(
				routeRepository.findByIdWithTrainAndStops(request.getRouteId()).orElse(null),
				request.getRouteId(),
				request.getFrom(),
				request.getTo(),
				request.getDate());

		Route route = journey.route();
		StopOrder fromStop = journey.fromStop();
		StopOrder toStop = journey.toStop();

		Seat seat = seatRepository.findByIdForUpdate(request.getSeatId())
				.orElseThrow(() -> {
					Map<String, String> errors = new HashMap<>();
					errors.put("seatId", "Seat not found");
					return new ValidationException(errors);
				});

		if (!seat.getCoach().getTrain().getId().equals(route.getTrain().getId())) {
			Map<String, String> errors = new HashMap<>();
			errors.put("seatId", "Seat does not belong to this route's train");
			throw new ValidationException(errors);
		}

		int fromSeq = fromStop.getStopSequence();
		int toSeq = toStop.getStopSequence();

		List<Booking> existing = bookingRepository.findBySeatIdAndTravelDateWithStops(
				seat.getId(), request.getDate());
		for (Booking booking : existing) {
			int bookedFrom = booking.getFromStopOrder().getStopSequence();
			int bookedTo = booking.getToStopOrder().getStopSequence();
			if (JourneyValidation.segmentsOverlap(bookedFrom, bookedTo, fromSeq, toSeq)) {
				throw new SeatUnavailableException(SEAT_UNAVAILABLE);
			}
		}

		Fare fare = fareRepository
				.findByRouteIdAndClassTypeIdAndStartStationIdAndEndStationId(
						route.getId(),
						seat.getCoach().getClassType().getId(),
						fromStop.getStation().getId(),
						toStop.getStation().getId())
				.orElseThrow(() -> {
					Map<String, String> errors = new HashMap<>();
					errors.put("seatId", "Fare not found for this journey and class");
					return new ValidationException(errors);
				});

		User user = userRepository.findById(userId)
				.orElseThrow(() -> new ValidationException(Map.of("routeId", "User not found")));

		Booking booking = new Booking();
		booking.setUser(user);
		booking.setAmount(fare.getPrice());
		booking.setStatus(BookingStatus.CONFIRMED);
		booking.setDate(request.getDate());
		booking.setSeat(seat);
		booking.setFromStopOrder(fromStop);
		booking.setToStopOrder(toStop);

		Booking saved = bookingRepository.save(booking);
		return toResponse(saved, route, "Booking confirmed");
	}

	@Transactional(readOnly = true)
	public BookingsResponse listMyBookings(Long userId) {
		List<BookingResponse> bookings = bookingRepository.findByUserIdWithDetails(userId).stream()
				.sorted(Comparator
						.comparing(Booking::getDate, Comparator.reverseOrder())
						.thenComparing(Booking::getId, Comparator.reverseOrder()))
				.map(b -> toResponse(b, b.getFromStopOrder().getRoute(), null))
				.toList();
		return new BookingsResponse(bookings);
	}

	private BookingResponse toResponse(Booking booking, Route route, String message) {
		Seat seat = booking.getSeat();
		Coach coach = seat.getCoach();
		StopOrder fromStop = booking.getFromStopOrder();
		StopOrder toStop = booking.getToStopOrder();

		return BookingResponse.builder()
				.id(booking.getId())
				.status(booking.getStatus())
				.amount(booking.getAmount())
				.date(booking.getDate())
				.trainName(route.getTrain().getName())
				.routeId(route.getId())
				.seat(new SeatSummary(seat.getId(), seat.getNumber()))
				.coach(new CoachSummary(coach.getId(), coach.getNumber()))
				.classType(new ClassTypeSummary(
						coach.getClassType().getId(),
						coach.getClassType().getName()))
				.fromStation(new StationSummary(
						fromStop.getStation().getId(),
						fromStop.getStation().getName()))
				.toStation(new StationSummary(
						toStop.getStation().getId(),
						toStop.getStation().getName()))
				.message(message)
				.build();
	}
}
