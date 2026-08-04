package com.train_seat.api.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.train_seat.api.dto.auth.AuthResponse;
import com.train_seat.api.dto.auth.LoginRequest;
import com.train_seat.api.dto.auth.SignupRequest;
import com.train_seat.api.dto.auth.UserResponse;
import com.train_seat.api.exception.DuplicateResourceException;
import com.train_seat.api.model.User;
import com.train_seat.api.repository.UserRepository;
import com.train_seat.api.security.JwtService;
import com.train_seat.api.security.UserPrincipal;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtService jwtService;
	private final AuthenticationManager authenticationManager;

	@Transactional
	public AuthResponse signup(SignupRequest request) {
		String email = request.getEmail().trim();
		if (userRepository.existsByUserName(email)) {
			throw new DuplicateResourceException("User already exists with this email");
		}

		User user = new User();
		user.setUserName(email);
		user.setPassword(passwordEncoder.encode(request.getPassword()));
		User saved = userRepository.save(user);

		return toAuthResponse(saved);
	}

	@Transactional(readOnly = true)
	public AuthResponse login(LoginRequest request) {
		String email = request.getEmail().trim();
		var authentication = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(email, request.getPassword()));

		UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
		return toAuthResponse(principal.getUser());
	}

	private AuthResponse toAuthResponse(User user) {
		UserResponse userResponse = new UserResponse(String.valueOf(user.getId()), user.getUserName());
		String token = jwtService.generateToken(user);
		return new AuthResponse(userResponse, token);
	}
}
