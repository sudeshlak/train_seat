package com.train_seat.api.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.train_seat.api.dto.booking.BookSeatRequest;
import com.train_seat.api.dto.booking.BookingResponse;
import com.train_seat.api.dto.booking.BookingsResponse;
import com.train_seat.api.security.UserPrincipal;
import com.train_seat.api.service.BookingService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class BookingController {

	private final BookingService bookingService;

	@PostMapping("/book/seat")
	public ResponseEntity<BookingResponse> bookSeat(
			@Valid @RequestBody BookSeatRequest request,
			Authentication authentication) {
		Long userId = currentUserId(authentication);
		return ResponseEntity.status(HttpStatus.CREATED).body(bookingService.book(request, userId));
	}

	@GetMapping("/bookings")
	public ResponseEntity<BookingsResponse> myBookings(Authentication authentication) {
		Long userId = currentUserId(authentication);
		return ResponseEntity.ok(bookingService.listMyBookings(userId));
	}

	private Long currentUserId(Authentication authentication) {
		UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
		return principal.getUser().getId();
	}
}
