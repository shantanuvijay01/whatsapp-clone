package com.spring.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;

import com.spring.model.Message;

@RestController
public class RealTimeChat {
	
	private SimpMessagingTemplate simpMessagingTemplate;
	
	@MessageMapping("/message")
	@SendTo("/group/public")
	public Message recieveMessage(@Payload Message message) {
		
		simpMessagingTemplate.convertAndSend("/group" + message.getChat().getId().toString(), message);
		
		return message;
	}
}
