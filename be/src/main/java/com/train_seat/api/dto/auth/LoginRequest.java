package com.train_seat.api.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class LoginRequest {

	@NotBlank
	private String email;

	@NotBlank
	@Size(min = 6, max = 100)
	private String password;
}
