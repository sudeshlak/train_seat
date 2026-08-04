package com.train_seat.api.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.train_seat.api.model.User;

public interface UserRepository extends JpaRepository<User, Long> {

	Optional<User> findByUserName(String userName);

	boolean existsByUserName(String userName);
}
