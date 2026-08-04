package com.train_seat.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.train_seat.api.dto.train.TrainsResponse;
import com.train_seat.api.service.TrainService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/trains")
@RequiredArgsConstructor
public class TrainController {

	private final TrainService trainService;

	@GetMapping
	public ResponseEntity<TrainsResponse> listTrains() {
		return ResponseEntity.ok(trainService.listTrains());
	}
}
