package edu.ucsb.cs156.gauchoride.entities;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import jakarta.persistence.GeneratedValue;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity(name = "driveravailability")
public class DriverAvailability {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;
  private long driverId;

  @Schema(allowableValues = "Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday")
  @Column(name = "\"day\"")
  private String day;
  
  private String startTime;
  private String endTime;
  private String notes;
}
