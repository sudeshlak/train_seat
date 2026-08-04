package com.train_seat.api.service;

import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.train_seat.api.dto.train.TrainResponse;
import com.train_seat.api.dto.train.TrainsResponse;
import com.train_seat.api.model.Route;
import com.train_seat.api.model.StopOrder;
import com.train_seat.api.repository.RouteRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TrainService {

	private static final DateTimeFormatter DEPARTURE_TIME = DateTimeFormatter.ofPattern("HH:mm");

	private final RouteRepository routeRepository;

	@Transactional(readOnly = true)
	public TrainsResponse listTrains() {
		List<TrainResponse> trains = routeRepository.findAllWithTrainAndStops().stream()
				.map(this::toTrainResponse)
				.toList();
		return new TrainsResponse(trains);
	}

	private TrainResponse toTrainResponse(Route route) {
		List<StopOrder> orderedStops = route.getStopOrders().stream()
				.sorted(Comparator.comparing(StopOrder::getStopSequence))
				.toList();

		List<String> stopStations = orderedStops.stream()
				.map(stop -> stop.getStation().getName())
				.toList();

		String from = stopStations.isEmpty() ? "" : stopStations.get(0);
		String to = stopStations.isEmpty() ? "" : stopStations.get(stopStations.size() - 1);

		return new TrainResponse(
				route.getId(),
				route.getTrain().getName(),
				route.getTime().format(DEPARTURE_TIME),
				from,
				to,
				stopStations);
	}
}
