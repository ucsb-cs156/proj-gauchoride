package edu.ucsb.cs156.gauchoride.services;

import java.io.FileInputStream;
import java.util.Collections;
import java.util.Date;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.stereotype.Service;

import org.springframework.beans.factory.annotation.Autowired;
import edu.ucsb.cs156.gauchoride.services.GoogleTokenService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.annotation.RegisteredOAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.Calendar.Events;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.AclRule;
import com.google.api.services.calendar.model.CalendarListEntry;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;

//import edu.ucsb.cs156.example.services.GoogleTokenService;
import com.google.api.client.http.javanet.NetHttpTransport;

@Slf4j
@Service("googlecalendarservice")
public class GoogleCalendarService {

    @Autowired
    GoogleTokenService googleTokenService;

    @Value("${app.gcal.calendarId:primary}")
    private String calendarId;

    private static final JsonFactory JSON_FACTORY = JacksonFactory.getDefaultInstance();
    private static final String APPLICATION_NAME = "Google Calendar API Java Quickstart";



    public boolean isCalendarConfigured(){
        if(!calendarId.equals("none")){
            return true;
        }

        return false;
    }

    public void giveUserAdminAccess(String email) throws Exception{
        // String principalName = authentication.getPrincipal().getName();
        // log.info("principalName={}", principalName);
        // String token = googleTokenService.getAccessToken(principalName).getTokenValue();
        // log.info("token={}", token);
        // GoogleCredential credential = new GoogleCredential().setAccessToken(token);
        // log.info("credential={}", credential);

        GoogleCredential credential = GoogleCredential.fromStream(new FileInputStream("credentials.json"))
            .createScoped(Collections.singleton("https://www.googleapis.com/auth/calendar"));

        NetHttpTransport httpTransport = GoogleNetHttpTransport.newTrustedTransport();
        Calendar service = new Calendar.Builder(httpTransport, JSON_FACTORY, credential)
                    .setApplicationName(APPLICATION_NAME).build();

        // CalendarListEntry calendarListEntry = new CalendarListEntry();
        // calendarListEntry.setId("calendarId");
        // CalendarListEntry createdCalendarListEntry = service.calendarList().insert(calendarListEntry).execute();

        
        AclRule rule = new AclRule();
        AclRule.Scope scope = new AclRule.Scope();
        scope.setType("user");
        scope.setValue(email);
        rule.setScope(scope);
        rule.setRole("reader");

        service.acl().insert(calendarId, rule).execute();


    }


}