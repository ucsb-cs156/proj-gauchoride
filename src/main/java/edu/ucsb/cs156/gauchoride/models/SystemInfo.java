package edu.ucsb.cs156.gauchoride.models;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;
import lombok.AccessLevel;


@Data
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
public class SystemInfo {
  private Boolean springH2ConsoleEnabled;
  private Boolean showSwaggerUILink;
  private String startQtrYYYYQ;
  private String endQtrYYYYQ;
  private String sourceRepo;
  private String commitMessage;
  private String commitId;
  private String githubUrl;
}
