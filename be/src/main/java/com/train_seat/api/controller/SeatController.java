package com.train_seat.api.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.train_seat.api.dto.booking.TodayBookedResponse;
import com.train_seat.api.dto.seat.AvailableSeatResponse;
import com.train_seat.api.dto.seat.SeatAvailabilityRequest;
import com.train_seat.api.dto.seat.SeatResponse;
import com.train_seat.api.service.SeatService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class SeatController {

	private final SeatService seatService;

	@PostMapping("/seats")
	public ResponseEntity<List<AvailableSeatResponse>> findAvailable(
			@Valid @RequestBody SeatAvailabilityRequest request) {
		return ResponseEntity.ok(seatService.findAvailable(request));
	}

	@GetMapping("/seatPlan/{routeId}")
	public ResponseEntity<List<SeatResponse>> seatPlan(@PathVariable Long routeId){
		return ResponseEntity.ok(seatService.seatPlan(routeId));
	}

	@GetMapping("todayBooked/{routeId}")
	public ResponseEntity<List<TodayBookedResponse>> todayBooked(@PathVariable Long routeId){
		return ResponseEntity.ok(seatService.todayBooked(routeId));
	}
}
