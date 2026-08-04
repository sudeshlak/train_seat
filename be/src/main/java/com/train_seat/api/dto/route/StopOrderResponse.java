package com.train_seat.api.dto.route;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StopOrderResponse {

	private Integer order;
	private StationSummary station;
}
