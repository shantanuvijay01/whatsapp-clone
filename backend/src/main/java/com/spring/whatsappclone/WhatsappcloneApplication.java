package com.spring.whatsappclone;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import com.spring.controller.AuthController;
import com.spring.controller.ChatController;
import com.spring.controller.HomeController;
import com.spring.controller.RealTimeChat;
import com.spring.controller.UserController;
import com.spring.model.Chat;
import com.spring.model.Message;
import com.spring.model.User;
import com.spring.repository.ChatRepository;
import com.spring.repository.MessageRepository;
import com.spring.repository.UserRepository;
import com.spring.service.UserServiceImplementation;

@SpringBootApplication(scanBasePackages = "com.spring.service")
@EnableAutoConfiguration
@ComponentScan(basePackages = {"com.spring.config", "com.spring.controller"})
@ComponentScan(basePackageClasses = {HomeController.class, AuthController.class, ChatController.class, RealTimeChat.class, UserController.class})
@EnableJpaRepositories(basePackageClasses = {UserRepository.class, ChatRepository.class, MessageRepository.class})
@EntityScan(basePackageClasses = {User.class, Chat.class, Message.class})
public class WhatsappcloneApplication {

	public static void main(String[] args) {
		SpringApplication.run(WhatsappcloneApplication.class, args);
	}

}
