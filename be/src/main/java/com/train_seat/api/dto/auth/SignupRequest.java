package com.train_seat.api.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SignupRequest {

	@NotBlank
	private String email;

	@NotBlank
	@Size(min = 6, max = 100)
	private String password;
}
