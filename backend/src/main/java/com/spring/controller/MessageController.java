package com.spring.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.spring.exception.ChatException;
import com.spring.exception.MessageException;
import com.spring.exception.UserException;
import com.spring.model.Message;
import com.spring.model.User;
import com.spring.request.SendMessageRequest;
import com.spring.response.ApiResponse;
import com.spring.service.MessageService;
import com.spring.service.UserService;

@RestController
@RequestMapping("api/messages")
public class MessageController {
	
	public MessageService messageService;
	public UserService userService;
	
	public MessageController(MessageService messageService,UserService userService) {
		this.messageService = messageService;
		this.userService = userService;
	}
	
	@PostMapping("/create")
	public ResponseEntity<Message> sendMessageHandler(@RequestBody SendMessageRequest req, @RequestHeader("Authorization") String jwt) throws UserException, ChatException{
		
		User user = userService.findUserProfile(jwt);
		
		req.setUserId(user.getId());
		Message message = messageService.sendMessage(req);
		
		return new ResponseEntity<Message>(message, HttpStatus.OK);
	}
	
	@GetMapping("/chat/{chatId}")
	public ResponseEntity<List<Message>> getChatMessagesHandler(@PathVariable Integer chatId, @RequestHeader("Authorization") String jwt) throws UserException, ChatException{
		
		User user = userService.findUserProfile(jwt);
		
		List<Message> message = messageService.getChatMessages(chatId, user);
		
		return new ResponseEntity<>(message, HttpStatus.OK);
	}
	
	@DeleteMapping("/{messageId}")
	public ResponseEntity<ApiResponse> deleteMessagesHandler(@PathVariable Integer messageId, @RequestHeader("Authorization") String jwt) throws UserException, MessageException{
		
		User user = userService.findUserProfile(jwt);
		
		messageService.deleteMessage(messageId, user);
		
		ApiResponse res = new ApiResponse("Message deleted successfully", false);
		return new ResponseEntity<>(res, HttpStatus.OK);
	}
}
