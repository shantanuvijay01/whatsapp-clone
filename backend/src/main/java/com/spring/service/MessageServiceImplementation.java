package com.spring.service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.spring.exception.ChatException;
import com.spring.exception.MessageException;
import com.spring.exception.UserException;
import com.spring.model.Chat;
import com.spring.model.Message;
import com.spring.model.User;
import com.spring.repository.ChatRepository;
import com.spring.repository.MessageRepository;
import com.spring.request.SendMessageRequest;

@Service
public class MessageServiceImplementation implements MessageService{
	
	private MessageRepository messageRepository;
//	private ChatRepository chatRepository;
	private UserService userService;
	private ChatService chatService;
	
	public MessageServiceImplementation(MessageRepository messageRepository, UserService userService, ChatService chatService) {
		this.messageRepository = messageRepository;
		this.userService = userService;
		this.chatService = chatService;
//		this.chatRepository = chatRepository;
	}

	@Override
	public Message sendMessage(SendMessageRequest req) throws UserException, ChatException {
		User user = userService.findUserById(req.getUserId());
		Chat chat = chatService.findChatById(req.getChatId());
		
		
		Message message = new Message();
		message.setChat(chat);
		message.setUser(user);
		message.setContent(req.getContent());
		message.setTimestamp(LocalDateTime.now());
		
//		chat.getMessages().add(message);
//		chatRepository.save(chat);
		messageRepository.save(message);
		
		return message;
	}

	@Override
	public List<Message> getChatMessages(Integer chatId, User reqUser) throws ChatException, UserException {
		
		Chat chat = chatService.findChatById(chatId);
		
		if(!chat.getUsers().contains(reqUser)) {
			throw new UserException("You are not related to this chat " + chatId);
		}
		
		List<Message> messages = messageRepository.findByChatId(chat.getId());
		
		return messages;
	}

	@Override
	public Message findMessageById(Integer messageId) throws MessageException {
		Optional<Message> opt = messageRepository.findById(messageId);
		
		if(opt.isPresent()) {
			return opt.get();
		}
		throw new MessageException("Message not found " + messageId);
	}

	@Override
	public void deleteMessage(Integer messageId, User reqUser) throws MessageException, UserException {
		Message message = findMessageById(messageId);
		
		if(message.getUser().getId().equals(reqUser.getId())) {
			messageRepository.deleteById(messageId);
		}
		
		throw new UserException("You can't delete another user's message " + reqUser.getFull_name());
	}

}
