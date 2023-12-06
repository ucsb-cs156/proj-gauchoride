package edu.ucsb.cs156.gauchoride.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;

import edu.ucsb.cs156.gauchoride.entities.User;
import edu.ucsb.cs156.gauchoride.models.ChatMessageWithUserInfo;

import java.util.Optional;

@Repository
public interface UserRepository extends CrudRepository<User, Long> {
  Optional<User> findByEmail(String email);
  Iterable<User> findByDriver(boolean driver);

  @Query("SELECT u.cellPhone FROM users u WHERE u.rider = true OR u.admin = true OR u.driver = true")
  Iterable<String> findAllMemberUserPhoneNumbers();
}
