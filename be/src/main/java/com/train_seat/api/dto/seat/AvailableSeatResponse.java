package com.train_seat.api.dto.seat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class AvailableSeatResponse extends SeatResponse {
    private boolean available;

    public AvailableSeatResponse(SeatSummary seat, CoachSummary coach, ClassTypeSummary classType, boolean available) {
        super(seat, coach, classType);
        this.available = available;
    }
}
