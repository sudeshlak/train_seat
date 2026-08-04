package com.train_seat.api.dto.route;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RouteDetailResponse {

	private String trainName;
	private String departureTime;
	private List<StopOrderResponse> stopOrder;
}
