package com.train_seat.api.service;

import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.train_seat.api.dto.route.RouteDetailResponse;
import com.train_seat.api.dto.route.StationSummary;
import com.train_seat.api.dto.route.StopOrderResponse;
import com.train_seat.api.exception.ResourceNotFoundException;
import com.train_seat.api.model.Route;
import com.train_seat.api.model.StopOrder;
import com.train_seat.api.repository.RouteRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RouteService {

	private static final DateTimeFormatter DEPARTURE_TIME = DateTimeFormatter.ofPattern("HH:mm");

	private final RouteRepository routeRepository;

	@Transactional(readOnly = true)
	public RouteDetailResponse getRoute(Long routeId) {
		Route route = routeRepository.findByIdWithTrainAndStops(routeId)
				.orElseThrow(() -> new ResourceNotFoundException("Route not found: " + routeId));

		List<StopOrderResponse> stopOrder = route.getStopOrders().stream()
				.sorted(Comparator.comparing(StopOrder::getStopSequence))
				.map(this::toStopOrderResponse)
				.toList();

		return new RouteDetailResponse(
				route.getTrain().getName(),
				route.getTime().format(DEPARTURE_TIME),
				stopOrder);
	}

	private StopOrderResponse toStopOrderResponse(StopOrder stop) {
		return new StopOrderResponse(
				stop.getStopSequence(),
				new StationSummary(stop.getStation().getId(), stop.getStation().getName()));
	}
}
