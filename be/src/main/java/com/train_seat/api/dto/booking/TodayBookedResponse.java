package com.train_seat.api.dto.booking;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TodayBookedResponse {
    private Long seatId;
    private String startStation;
    private String endStation;
}
