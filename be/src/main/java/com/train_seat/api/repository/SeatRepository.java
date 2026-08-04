package com.train_seat.api.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.train_seat.api.model.Seat;

public interface SeatRepository extends JpaRepository<Seat, Long> {

	@Query("""
			SELECT DISTINCT s FROM Seat s
			JOIN FETCH s.coach c
			JOIN FETCH c.classType
			WHERE c.train.id = :trainId
			""")
	List<Seat> findAllByTrainIdWithCoachAndClassType(@Param("trainId") Long trainId);
}
