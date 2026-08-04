package com.train_seat.api.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.train_seat.api.model.Seat;

import jakarta.persistence.LockModeType;

public interface SeatRepository extends JpaRepository<Seat, Long> {

	@Query("""
			SELECT DISTINCT s FROM Seat s
			JOIN FETCH s.coach c
			JOIN FETCH c.classType
			WHERE c.train.id = :trainId
			  AND c.onlineBookable = true
			""")
	List<Seat> findOnlineBookableByTrainIdWithCoachAndClassType(@Param("trainId") Long trainId);

	@Lock(LockModeType.PESSIMISTIC_WRITE)
	@Query("""
			SELECT s FROM Seat s
			JOIN FETCH s.coach c
			JOIN FETCH c.classType
			JOIN FETCH c.train
			WHERE s.id = :id
			""")
	Optional<Seat> findByIdForUpdate(@Param("id") Long id);
}
