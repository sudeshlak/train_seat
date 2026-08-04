package com.train_seat.api.exception;

import java.util.Collections;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class ValidationException extends RuntimeException {

	private final Map<String, String> fieldErrors;

	public ValidationException(Map<String, String> fieldErrors) {
		super("Validation failed");
		this.fieldErrors = fieldErrors == null ? Collections.emptyMap() : Map.copyOf(fieldErrors);
	}

	public Map<String, String> getFieldErrors() {
		return fieldErrors;
	}
}
