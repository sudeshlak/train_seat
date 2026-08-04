package com.train_seat.api.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.HashMap;
import java.util.Map;

import com.train_seat.api.exception.ValidationException;
import com.train_seat.api.model.Route;
import com.train_seat.api.model.StopOrder;

/**
 * Shared journey validation for seat availability and booking confirmation.
 */
public final class JourneyValidation {

	public static final ZoneId COLOMBO = ZoneId.of("Asia/Colombo");

	private JourneyValidation() {
	}

	public record ValidatedJourney(Route route, StopOrder fromStop, StopOrder toStop) {
	}

	public static ValidatedJourney validate(
			Route route,
			Long routeId,
			Long fromStationId,
			Long toStationId,
			LocalDate date) {
		Map<String, String> errors = new HashMap<>();

		if (route == null) {
			errors.put("routeId", "Route not found");
			validateDate(date, null, errors);
			throw new ValidationException(errors);
		}

		StopOrder fromStop = findStopByStationId(route, fromStationId);
		StopOrder toStop = findStopByStationId(route, toStationId);

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

		validateDate(date, route.getTime(), errors);

		if (!errors.isEmpty()) {
			throw new ValidationException(errors);
		}

		return new ValidatedJourney(route, fromStop, toStop);
	}

	public static boolean segmentsOverlap(int bookedFrom, int bookedTo, int requestFrom, int requestTo) {
		return bookedFrom < requestTo && bookedTo > requestFrom;
	}

	public static StopOrder findStopByStationId(Route route, Long stationId) {
		return route.getStopOrders().stream()
				.filter(stop -> stop.getStation().getId().equals(stationId))
				.findFirst()
				.orElse(null);
	}

	public static void validateDate(LocalDate date, LocalTime departureTime, Map<String, String> errors) {
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
}
