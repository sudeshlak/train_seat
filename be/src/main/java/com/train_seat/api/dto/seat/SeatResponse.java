package com.train_seat.api.dto.seat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SeatResponse {
    private SeatSummary seat;
	private CoachSummary coach;
	private ClassTypeSummary classType;
}
