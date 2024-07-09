package com.spring.service;

import java.util.List;

import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import com.spring.exception.UserException;
import com.spring.model.User;
import com.spring.request.UpdateUserRequest;

@Component
public interface UserService {

	public User findUserById(Integer id) throws UserException;
	public User findUserProfile(String jwt) throws UserException;
	public User updateUser(Integer userId, UpdateUserRequest req) throws UserException;
	public List<User> searchUser(String query);
	
}
