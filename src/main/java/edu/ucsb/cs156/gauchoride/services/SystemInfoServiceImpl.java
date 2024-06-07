package edu.ucsb.cs156.gauchoride.services;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.annotation.PropertySources;
import org.springframework.stereotype.Service;

import edu.ucsb.cs156.gauchoride.models.SystemInfo;

// This class relies on property values
// For hints on testing, see: https://www.baeldung.com/spring-boot-testing-configurationproperties

@Slf4j
@Service("systemInfo")
@PropertySources(@PropertySource("classpath:git.properties"))
@ConfigurationProperties
public class SystemInfoServiceImpl extends SystemInfoService {

  @Value("${spring.h2.console.enabled:false}")
  private boolean springH2ConsoleEnabled;

  @Value("${app.showSwaggerUILink:false}")
  private boolean showSwaggerUILink;

  // adding values for github commit information

  @Value("${app.startQtrYYYYQ:20221}")
  private String startQtrYYYYQ;

  @Value("${app.endQtrYYYYQ:20222}")
  private String endQtrYYYYQ;

  @Value("${app.sourceRepo:https://github.com/ucsb-cs156/proj-gauchoride}")
  private String sourceRepo;

  @Value("${git.commit.message.short:unknown}")
  private String commitMessage;

  @Value("${git.commit.id.abbrev:unknown}")
  private String commitId;

  public static String githubUrl(String repo, String commit) {
    return commit != null && repo != null ? repo + "/commit/" + commit : null;
  }

  // end of new things added

  public SystemInfo getSystemInfo() {
    SystemInfo si = SystemInfo.builder()
        .springH2ConsoleEnabled(this.springH2ConsoleEnabled)
        .showSwaggerUILink(this.showSwaggerUILink)

        // added for git commit info feature
        .startQtrYYYYQ(this.startQtrYYYYQ)
        .endQtrYYYYQ(this.endQtrYYYYQ)
        .sourceRepo(this.sourceRepo)
        .commitMessage(this.commitMessage)
        .commitId(this.commitId)
        .githubUrl(githubUrl(this.sourceRepo, this.commitId))
        .build();
    log.info("getSystemInfo returns {}", si);
    return si;
  }

}
