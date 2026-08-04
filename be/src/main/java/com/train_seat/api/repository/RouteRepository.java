package com.train_seat.api.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.train_seat.api.model.Route;

public interface RouteRepository extends JpaRepository<Route, Long> {

	@Query("""
			SELECT DISTINCT r FROM Route r
			JOIN FETCH r.train
			LEFT JOIN FETCH r.stopOrders so
			LEFT JOIN FETCH so.station
			""")
	List<Route> findAllWithTrainAndStops();
}
