package com.spring.exception;

import java.time.LocalDateTime;

public class ErrorDetail {
	
	private String error;
	private String message;
	private LocalDateTime timeStamp;
	public ErrorDetail(String error, String message, LocalDateTime timeStamp) {
		super();
		this.error = error;
		this.message = message;
		this.timeStamp = timeStamp;
	}
	
}
