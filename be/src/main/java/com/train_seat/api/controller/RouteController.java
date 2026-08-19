package com.train_seat.api.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.train_seat.api.dto.route.AvaialableRoutesResponse;
import com.train_seat.api.dto.route.RouteDetailResponse;
import com.train_seat.api.service.RouteService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/route")
@RequiredArgsConstructor
public class RouteController {

	private final RouteService routeService;

    @GetMapping("/available")
    public ResponseEntity<AvaialableRoutesResponse> getAvailableRoutes() {
        return ResponseEntity.ok(routeService.getAvailableRoutes());
    }
    
	@GetMapping("/{routeId}")
	public ResponseEntity<RouteDetailResponse> getRoute(@PathVariable Long routeId) {
		return ResponseEntity.ok(routeService.getRoute(routeId));
	}
}
