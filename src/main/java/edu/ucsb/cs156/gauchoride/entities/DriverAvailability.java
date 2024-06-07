package edu.ucsb.cs156.gauchoride.entities;

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
  private String day;
  private String startTime;
  private String endTime;
  private String notes;
}
