package edu.ucsb.cs156.gauchoride.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import org.hibernate.annotations.CreationTimestamp;
import jakarta.persistence.GeneratedValue;

import java.time.LocalDateTime;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity(name = "chat_messages")
public class ChatMessage {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private long userId;
  private String payload;

  @CreationTimestamp
  private LocalDateTime timestamp;

    //UNUSED: TO IMPL LATER
  private boolean dm;
  private Long toUserId;
}