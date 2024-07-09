package com.spring.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import com.spring.config.TokenProvider;
import com.spring.exception.UserException;
import com.spring.model.User;
import com.spring.repository.UserRepository;
import com.spring.request.LoginRequest;
import com.spring.response.AuthResponse;
import com.spring.service.CustomUserService;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/auth")
public class AuthController {
	
	private UserRepository userRepository;
	private PasswordEncoder passwordEncoder;
	private TokenProvider tokenProvider;
	private CustomUserService customUserService;
	
	public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, TokenProvider tokenProvider, CustomUserService customUserService) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.tokenProvider = tokenProvider;
		this.customUserService = customUserService;
	}
	
	@PostMapping("/signup")
	public ResponseEntity<AuthResponse> createUserHandler(@RequestBody User user) throws UserException {
		String email = user.getEmail();
		String full_name = user.getFull_name();
		String password = user.getPassword();
		
		User isUser = userRepository.findByEmail(email);
		
		if(isUser != null) {
			throw new UserException("Email is used by another account " + email);
		}
		
		User createdUser = new User();
		createdUser.setEmail(email);
		createdUser.setFull_name(full_name);
		createdUser.setPassword(passwordEncoder.encode(password));
		
		userRepository.save(createdUser);
		
		Authentication authentication = new UsernamePasswordAuthenticationToken(email, password);
		SecurityContextHolder.getContext().setAuthentication(authentication);
		
		String jwt = tokenProvider.generateToken(authentication);
		
		AuthResponse res = new AuthResponse(jwt, true);
		
		return new ResponseEntity<AuthResponse>(res, HttpStatus.ACCEPTED);
	}
	
	@PostMapping("/signin")
	public ResponseEntity<AuthResponse> loginHandler(@RequestBody LoginRequest req){
		String email = req.getEmail();
		String password = req.getPassword();
		
		Authentication authentication = authenticate(email, password);
		SecurityContextHolder.getContext().setAuthentication(authentication);

		String jwt = tokenProvider.generateToken(authentication);
		
		AuthResponse res = new AuthResponse(jwt, true);
		
		return new ResponseEntity<AuthResponse>(res, HttpStatus.ACCEPTED);
	}
	
	public Authentication authenticate(String Username, String password) {
		UserDetails userDetails = customUserService.loadUserByUsername(Username);
		
		if(userDetails == null) {
			throw new BadCredentialsException("Invalid username");
		}
		if(!passwordEncoder.matches(password, userDetails.getPassword())) {
			throw new BadCredentialsException("Invalid password or username");
		}
		
		return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
	}
}
