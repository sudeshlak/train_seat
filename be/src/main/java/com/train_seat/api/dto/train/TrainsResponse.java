package com.train_seat.api.dto.train;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrainsResponse {

	private List<TrainResponse> trains;
}
