package com.train_seat.api.dto.booking;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingsResponse {

	private List<BookingResponse> bookings;
}
