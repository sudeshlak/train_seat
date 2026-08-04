package com.train_seat.api.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.train_seat.api.model.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {

	@Query("""
			SELECT DISTINCT b FROM Booking b
			JOIN FETCH b.seat s
			JOIN FETCH b.fromStopOrder
			JOIN FETCH b.toStopOrder
			JOIN s.coach c
			WHERE b.date = :travelDate
			  AND c.train.id = :trainId
			""")
	List<Booking> findByTravelDateAndTrainIdWithStops(
			@Param("travelDate") LocalDate travelDate,
			@Param("trainId") Long trainId);
}
