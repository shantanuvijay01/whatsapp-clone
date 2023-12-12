package com.spring.controller;

import java.util.HashSet;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.spring.exception.UserException;
import com.spring.model.User;
import com.spring.request.UpdateUserRequest;
import com.spring.response.ApiResponse;
import com.spring.service.UserService;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("api/users")
public class UserController {
	
	@Autowired
	private UserService userService;
	
	public UserController(UserService userService) {
		this.userService = userService;
	}

	@GetMapping("/profile")
	public ResponseEntity<User> getUserProfileHandler(@RequestHeader("Authorization") String token) throws UserException {
		
		User user = userService.findUserProfile(token);
		
		return new ResponseEntity<User>(user, HttpStatus.ACCEPTED);
	}
	
	@GetMapping("/{query}")
	public ResponseEntity<List<User>> searchUserProfileHandler(@PathVariable("query") String q) {
		List<User> users = userService.searchUser(q);
		
		return new ResponseEntity<List<User>>(users, HttpStatus.OK);
	}
	
	@GetMapping("/search")
	public ResponseEntity<HashSet> searchUsersByName(@RequestParam("name") String name) {
		List<User> users = userService.searchUser(name);
		
		HashSet<User> set = new HashSet<>(users);
		
//		HashSet<UserDto> userDtos = UserDtoMapper.toUserDtos(set);
		
		return new ResponseEntity<>(set, HttpStatus.ACCEPTED);
	}
	
	@PutMapping("/update")
	public ResponseEntity<ApiResponse> updateUserHandler(@RequestBody UpdateUserRequest req, @RequestHeader("Authorization") String token) throws UserException {
		
		User user = userService.findUserProfile(token);
		System.out.println("Updated user:" + user.getFull_name());
		
		userService.updateUser(user.getId(), req);
		ApiResponse res = new ApiResponse("user updated successfully", true);
		
		return new ResponseEntity<ApiResponse>(res, HttpStatus.ACCEPTED);
	}
}
