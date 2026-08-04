package com.train_seat.api.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.train_seat.api.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

	private final UserRepository userRepository;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		return userRepository.findByUserName(username)
				.map(UserPrincipal::new)
				.orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
	}

	public UserDetails loadUserById(Long id) {
		return userRepository.findById(id)
				.map(UserPrincipal::new)
				.orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + id));
	}
}
