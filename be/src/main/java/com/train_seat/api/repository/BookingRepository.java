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

	@Query("""
			SELECT DISTINCT b FROM Booking b
			JOIN FETCH b.seat s
			JOIN FETCH b.fromStopOrder
			JOIN FETCH b.toStopOrder
			WHERE b.seat.id = :seatId
			  AND b.date = :travelDate
			""")
	List<Booking> findBySeatIdAndTravelDateWithStops(
			@Param("seatId") Long seatId,
			@Param("travelDate") LocalDate travelDate);

	@Query("""
			SELECT DISTINCT b FROM Booking b
			JOIN FETCH b.seat s
			JOIN FETCH s.coach c
			JOIN FETCH c.classType
			JOIN FETCH c.train
			JOIN FETCH b.fromStopOrder fs
			JOIN FETCH fs.station
			JOIN FETCH fs.route r
			JOIN FETCH r.train
			JOIN FETCH b.toStopOrder ts
			JOIN FETCH ts.station
			WHERE b.user.id = :userId
			""")
	List<Booking> findByUserIdWithDetails(@Param("userId") Long userId);
}
