package com.spring.service;

import java.util.List;

import com.spring.exception.ChatException;
import com.spring.exception.MessageException;
import com.spring.exception.UserException;
import com.spring.model.Message;
import com.spring.model.User;
import com.spring.request.SendMessageRequest;

public interface MessageService {
	
	public Message sendMessage(SendMessageRequest req) throws UserException, ChatException;
	
	public List<Message> getChatMessages(Integer chatId, User reqUser) throws ChatException, UserException;
	
	public Message findMessageById(Integer messageId) throws MessageException;
	
	public void deleteMessage(Integer messageId, User reqUser) throws MessageException, UserException;
}
