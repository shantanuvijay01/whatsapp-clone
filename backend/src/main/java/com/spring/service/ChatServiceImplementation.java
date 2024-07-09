package com.spring.service;

import java.util.List;

import org.apache.el.stream.Optional;
import org.springframework.stereotype.Service;

import com.spring.exception.ChatException;
import com.spring.exception.UserException;
import com.spring.model.Chat;
import com.spring.model.User;
import com.spring.repository.ChatRepository;

@Service
public class ChatServiceImplementation implements ChatService{
	
	private ChatRepository chatRepository;
	private UserService userService;
	
	public ChatServiceImplementation(ChatRepository chatRepository, UserService userService) {
		this.chatRepository = chatRepository;
		this.userService = userService;
	}

	@Override
	public Chat createChat(User reqUser, Integer userId) throws UserException {
		User user = userService.findUserById(userId);
		Chat isChatExist = chatRepository.findSingleChatByUserIds(user, reqUser);
		
		if(isChatExist != null) {
			return isChatExist;
		}
		
		Chat chat = new Chat();
		chat.setId(user.getId() + reqUser.getId());
		chat.setCreatedBy(user);
		chat.getUsers().add(user);
		chat.getUsers().add(reqUser);
		chat.setGroup(false);
		
		chatRepository.save(chat);
		return chat;
	}

	@Override
	public Chat findChatById(Integer chatId) throws ChatException {
		java.util.Optional<Chat> chat = chatRepository.findById(chatId);
		
		if(chat.isPresent()) {
			return chat.get();
		}
		throw new ChatException("Chat not found with id " + chatId);
	}

	@Override
	public List<Chat> findAllChatByUserId(Integer userId) throws UserException {
		User user = userService.findUserById(userId);
		
		List<Chat> chats = chatRepository.findChatByUserId(user.getId()); 
		return chats;
	}

	@Override
	public Chat createGroup(GroupChatRequest req, User reqUser) throws UserException {
		
		Chat group = new Chat();
		
		group.setGroup(true);
		group.setChat_image(req.getChat_image());
		group.setChat_name(req.getChat_name());
		group.setCreatedBy(reqUser);
		group.getAdmins().add(reqUser);
		Integer chat_id = 0;
		for(Integer userId : req.getUserIds()) {
			chat_id += userId;
			User user = userService.findUserById(userId);
			group.getUsers().add(user);
		}
		group.getUsers().add(reqUser);
		group.setId(reqUser.getId() + chat_id);
		chatRepository.save(group);
		return group;
	}

	@Override
	public Chat addUserToGroup(Integer userId, Integer chatId, User reqUser) throws UserException, ChatException {
		
		java.util.Optional<Chat> opt = chatRepository.findById(chatId);
		
		User user = userService.findUserById(userId);
		
		if(opt.isPresent()) {
			
			Chat chat = opt.get();
			if(chat.getAdmins().contains(reqUser)) {
				chat.getUsers().add(user);
				return chatRepository.save(chat);
			} else {
				throw new UserException("User is not admin " + userId);
			}
		}
		throw new ChatException("Chat not found with id " + chatId);
	}
	
	@Override
	public Chat renameGroup(Integer chatId, String groupName, User reqUser) throws UserException, ChatException {
		java.util.Optional<Chat> opt = chatRepository.findById(chatId);
		if(opt.isPresent()) {
			Chat chat = opt.get();
			if(chat.getUsers().contains(reqUser)) {
				chat.setChat_name(groupName);
				return chatRepository.save(chat);
			}else
			throw new UserException("User is not member of this group");
			}
		throw new ChatException("Chat not found with id " + chatId);
	}

	@Override
	public Chat removeFromGroup(Integer chatId, Integer userId, User reqUser) throws UserException, ChatException {
		java.util.Optional<Chat> opt = chatRepository.findById(chatId);
		
		User user = userService.findUserById(userId);
		if(opt.isPresent()) {
			Chat chat = opt.get();
			if(chat.getAdmins().contains(reqUser)) {
				chat.getUsers().remove(user);
				return chatRepository.save(chat);
			}else if(chat.getUsers().contains(reqUser)) {
				if(user.getId().equals(reqUser.getId())) {
					chat.getUsers().remove(user);
					return chatRepository.save(chat);
				}
			}
			throw new UserException("User can't remove");
			}
		throw new ChatException("Chat not found with id " + chatId);		
	}

	@Override
	public void deleteChat(Integer chatId, Integer userId) throws UserException, ChatException {
		java.util.Optional<Chat> opt = chatRepository.findById(chatId);
		
		if(opt.isPresent()) {
			Chat chat = opt.get();
			chatRepository.deleteById(chat.getId());
		}
	}

}
