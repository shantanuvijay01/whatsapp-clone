package com.spring.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import com.spring.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Integer>{

	public User findByEmail(String email);

	Optional<User> findById(Integer id);

	public User save(User user);
	
	@Query("select u from User u where u.full_name Like %:query% or u.email Like %:query%")
	public List<User> searchUser(@Param("query") String query);

}
