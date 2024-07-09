package com.spring.service;

import java.util.List;

import com.spring.exception.ChatException;
import com.spring.exception.UserException;
import com.spring.model.Chat;
import com.spring.model.User;

public interface ChatService {
	
	public Chat createChat(User reqUser, Integer userId) throws UserException;
	
	public Chat findChatById(Integer chatId) throws ChatException;
	
	public List<Chat> findAllChatByUserId(Integer userId) throws UserException;
	
	public Chat createGroup(GroupChatRequest rew, User reqUser) throws UserException;
	
	public Chat addUserToGroup(Integer userId, Integer chatId, User reqUser) throws UserException, ChatException;
	
	public Chat renameGroup(Integer chatId, String groupName, User reqUser) throws UserException, ChatException;
	
	public Chat removeFromGroup(Integer chatId, Integer userId, User reqUser) throws UserException, ChatException;
	
	public void deleteChat(Integer chatId, Integer userId) throws UserException, ChatException;
}
