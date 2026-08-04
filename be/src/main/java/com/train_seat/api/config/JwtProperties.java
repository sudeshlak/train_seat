package com.train_seat.api.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Data;

@Data
@ConfigurationProperties(prefix = "app.jwt")
public class JwtProperties {

	/**
	 * HS256 signing secret; must be at least 32 characters.
	 */
	private String secret;

	/**
	 * Token lifetime in milliseconds.
	 */
	private long expirationMs = 86_400_000L;
}
