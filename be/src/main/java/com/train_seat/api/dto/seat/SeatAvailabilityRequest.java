package com.train_seat.api.dto.seat;

import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SeatAvailabilityRequest {

	@NotNull
	private Long routeId;

	@NotNull
	private Long from;

	@NotNull
	private Long to;

	@NotNull
	private LocalDate date;
}
