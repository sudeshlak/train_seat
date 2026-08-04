package com.train_seat.api.dto.booking;

import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BookSeatRequest {

	@NotNull
	private Long routeId;

	@NotNull
	private Long seatId;

	@NotNull
	private Long from;

	@NotNull
	private Long to;

	@NotNull
	private LocalDate date;
}
