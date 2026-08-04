package com.train_seat.api.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.train_seat.api.dto.seat.AvailableSeatResponse;
import com.train_seat.api.dto.seat.ClassTypeSummary;
import com.train_seat.api.dto.seat.CoachSummary;
import com.train_seat.api.dto.seat.SeatAvailabilityRequest;
import com.train_seat.api.dto.seat.SeatSummary;
import com.train_seat.api.exception.ValidationException;
import com.train_seat.api.model.Booking;
import com.train_seat.api.model.Coach;
import com.train_seat.api.model.Route;
import com.train_seat.api.model.Seat;
import com.train_seat.api.model.StopOrder;
import com.train_seat.api.repository.BookingRepository;
import com.train_seat.api.repository.RouteRepository;
import com.train_seat.api.repository.SeatRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SeatService {

	private static final ZoneId COLOMBO = ZoneId.of("Asia/Colombo");

	private final RouteRepository routeRepository;
	private final SeatRepository seatRepository;
	private final BookingRepository bookingRepository;

	@Transactional(readOnly = true)
	public List<AvailableSeatResponse> findAvailable(SeatAvailabilityRequest request) {
		Route route = routeRepository.findByIdWithTrainAndStops(request.getRouteId()).orElse(null);

		Map<String, String> errors = new HashMap<>();
		if (route == null) {
			errors.put("routeId", "Route not found");
		}

		StopOrder fromStop = null;
		StopOrder toStop = null;
		if (route != null) {
			fromStop = findStopByStationId(route, request.getFrom());
			toStop = findStopByStationId(route, request.getTo());

			if (fromStop == null) {
				errors.put("from", "Station is not on this route");
			}
			if (toStop == null) {
				errors.put("to", "Station is not on this route");
			}
			if (fromStop != null && toStop != null
					&& fromStop.getStopSequence() >= toStop.getStopSequence()) {
				errors.put("to", "Destination must be after the departure station");
			}

			validateDate(request.getDate(), route.getTime(), errors);
		} else {
			validateDate(request.getDate(), null, errors);
		}

		if (!errors.isEmpty()) {
			throw new ValidationException(errors);
		}

		// Validated above: route, fromStop, and toStop are present with fromSeq < toSeq.
		Route validRoute = route;
		StopOrder validFrom = fromStop;
		StopOrder validTo = toStop;

		Long trainId = validRoute.getTrain().getId();
		int fromSeq = validFrom.getStopSequence();
		int toSeq = validTo.getStopSequence();

		List<Seat> seats = seatRepository.findAllByTrainIdWithCoachAndClassType(trainId);
		List<Booking> bookings = bookingRepository.findByTravelDateAndTrainIdWithStops(
				request.getDate(), trainId);

		Set<Long> occupiedSeatIds = new HashSet<>();
		for (Booking booking : bookings) {
			int bookedFrom = booking.getFromStopOrder().getStopSequence();
			int bookedTo = booking.getToStopOrder().getStopSequence();
			if (bookedFrom < toSeq && bookedTo > fromSeq) {
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

	private void validateDate(LocalDate date, LocalTime departureTime, Map<String, String> errors) {
		if (date == null) {
			return;
		}

		LocalDate today = LocalDate.now(COLOMBO);
		if (date.isBefore(today)) {
			errors.put("date", "Date must be today or in the future");
			return;
		}

		if (date.isEqual(today) && departureTime != null) {
			LocalTime now = LocalTime.now(COLOMBO);
			if (now.isAfter(departureTime)) {
				errors.put("date", "Departure time has already passed for today");
			}
		}
	}

	private StopOrder findStopByStationId(Route route, Long stationId) {
		return route.getStopOrders().stream()
				.filter(stop -> stop.getStation().getId().equals(stationId))
				.findFirst()
				.orElse(null);
	}

	private AvailableSeatResponse toAvailableSeatResponse(Seat seat) {
		Coach coach = seat.getCoach();
		return new AvailableSeatResponse(
				new SeatSummary(seat.getId(), seat.getNumber()),
				new CoachSummary(coach.getId(), coach.getNumber()),
				new ClassTypeSummary(coach.getClassType().getId(), coach.getClassType().getName()));
	}
}
