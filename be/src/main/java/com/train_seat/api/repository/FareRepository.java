package com.train_seat.api.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.train_seat.api.model.Fare;

public interface FareRepository extends JpaRepository<Fare, Long> {

	@Query("""
			SELECT f FROM Fare f
			WHERE f.route.id = :routeId
			  AND f.classType.id = :classTypeId
			  AND f.startStation.id = :startStationId
			  AND f.endStation.id = :endStationId
			""")
	Optional<Fare> findByRouteIdAndClassTypeIdAndStartStationIdAndEndStationId(
			@Param("routeId") Long routeId,
			@Param("classTypeId") Long classTypeId,
			@Param("startStationId") Long startStationId,
			@Param("endStationId") Long endStationId);
}
