package com.train_seat.api.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.train_seat.api.model.Route;

public interface RouteRepository extends JpaRepository<Route, Long> {

	@Query("""
			SELECT DISTINCT r FROM Route r
			JOIN FETCH r.train
			LEFT JOIN FETCH r.stopOrders so
			LEFT JOIN FETCH so.station
			""")
	List<Route> findAllWithTrainAndStops();

	@Query("""
			SELECT DISTINCT r FROM Route r
			JOIN FETCH r.train
			LEFT JOIN FETCH r.stopOrders so
			LEFT JOIN FETCH so.station
			WHERE r.id = :id
			""")
	Optional<Route> findByIdWithTrainAndStops(@Param("id") Long id);
}
