package com.train_seat.api.dto.train;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrainResponse {

	private Long routeId;
	private String trainName;
	private String departureTime;
	private String from;
	private String to;
	private List<String> stopStations;
}
