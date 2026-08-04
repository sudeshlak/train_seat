package com.train_seat.api.dto.booking;

import java.time.LocalDate;

import com.train_seat.api.dto.route.StationSummary;
import com.train_seat.api.dto.seat.ClassTypeSummary;
import com.train_seat.api.dto.seat.CoachSummary;
import com.train_seat.api.dto.seat.SeatSummary;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingResponse {

	private Long id;
	private String status;
	private Double amount;
	private LocalDate date;
	private String trainName;
	private Long routeId;
	private SeatSummary seat;
	private CoachSummary coach;
	private ClassTypeSummary classType;
	private StationSummary fromStation;
	private StationSummary toStation;
	private String message;
}
