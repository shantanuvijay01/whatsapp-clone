package com.spring.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {
	
	@GetMapping("/home")
	public ResponseEntity<String> HomeController(){
		System.out.println("Home controller fired");
		return new ResponseEntity<String>("Welcome to whatsapp", HttpStatus.OK);
	}
}
