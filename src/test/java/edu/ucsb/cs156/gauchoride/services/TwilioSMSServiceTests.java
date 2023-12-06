package edu.ucsb.cs156.gauchoride.services;

import edu.ucsb.cs156.gauchoride.repositories.TwilioErrorRepository;
import edu.ucsb.cs156.gauchoride.entities.TwilioError;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.test.util.ReflectionTestUtils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.twilio.Twilio;
import com.twilio.exception.ApiException;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.rest.api.v2010.account.MessageCreator;
import com.twilio.type.PhoneNumber;
import java.util.List;
import java.util.Arrays;
import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TwilioSMSServiceTests {

    @Mock
    private TwilioErrorRepository errorRepository;

    @InjectMocks
    private TwilioSMSService twilioSMSService;

    @Value("${twilio.account.sid:twilio_account_sid_unset}")
    protected String ACCOUNT_SID = "";

    @Value("${twilio.auth.token:twilio_auth_token_unset}")
    protected String AUTH_TOKEN = "";

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        ReflectionTestUtils.setField(twilioSMSService, "ACCOUNT_SID", ACCOUNT_SID);
        ReflectionTestUtils.setField(twilioSMSService, "AUTH_TOKEN", AUTH_TOKEN);
    }

@Test
public void testSendSMSToOne_NoError() {

    String messageJson = "{"
    + "\"sid\": \"mocked_sid\","
    + "\"body\": \"Test SMS content\","
    + "\"from\": \"+1234567890\","
    + "\"to\": \"+9876543210\""
    + "}";

    ObjectMapper objectMapper = new ObjectMapper();

    Message mockedMessage = Message.fromJson(messageJson, objectMapper);
    
    MessageCreator messageCreator = mock(MessageCreator.class);
    when(messageCreator.create()).thenReturn(mockedMessage);
    try (MockedStatic<Message> staticMessage = mockStatic(Message.class)) {
        staticMessage.when(() -> Message.creator(
                any(PhoneNumber.class),
                any(PhoneNumber.class),
                anyString()))
            .thenReturn(messageCreator);

    // Test data
    String receiver = "receiver1";
    String content = "Test SMS content";

    // Test method
    String messageSid = twilioSMSService.sendSMSToOne(receiver, content);

    // Verify Twilio API call
    verify(messageCreator).create();

    // Verify errorRepository.save() not called
    verify(errorRepository, never()).save(any(TwilioError.class));

    // Verify returned message SID
    assertEquals("mocked_sid", messageSid);
}
}

@Test
public void testSendSMSToAll_NoError() {

    String messageJson = "{"
    + "\"sid\": \"mocked_sid\","
    + "\"body\": \"Test SMS content\","
    + "\"from\": \"+1234567890\","
    + "\"to\": \"+9876543210\""
    + "}";

    ObjectMapper objectMapper = new ObjectMapper();

    Message mockedMessage = Message.fromJson(messageJson, objectMapper);
    
    MessageCreator messageCreator = mock(MessageCreator.class);
    when(messageCreator.create()).thenReturn(mockedMessage);
    try (MockedStatic<Message> staticMessage = mockStatic(Message.class)) {
        staticMessage.when(() -> Message.creator(
                any(PhoneNumber.class),
                any(PhoneNumber.class),
                anyString()))
            .thenReturn(messageCreator);

    // Test data
    List<String> receivers = Arrays.asList("receiver1", "receiver2");
    String content = "Test SMS content";

    // Test method
    List<String> messageSids = twilioSMSService.sendSMSToAll(receivers, content);

    // Verify Twilio API call
    verify(messageCreator, times(2)).create();

    // Verify errorRepository.save() not called
    verify(errorRepository, never()).save(any(TwilioError.class));

    // Verify returned message SID
    assertEquals(2, messageSids.size());
    assertEquals("mocked_sid", messageSids.get(0));
    assertEquals("mocked_sid", messageSids.get(1));
}
}

@Test
public void testSendSMSToOne_Error() {
    
    ApiException apiException = new ApiException("Some Error");
    MessageCreator messageCreator = mock(MessageCreator.class);
    when(messageCreator.create()).thenThrow(apiException);

    try (MockedStatic<Message> staticMessage = mockStatic(Message.class)) {
        staticMessage.when(() -> Message.creator(
                any(PhoneNumber.class),
                any(PhoneNumber.class),
                anyString()))
            .thenReturn(messageCreator);

    // Test data
    String receiver = "receiver1";
    String content = "Test SMS content";

    // Test method
    String messageSid = twilioSMSService.sendSMSToOne(receiver, content);

    // Verify Twilio API call
    verify(messageCreator).create();

    // Verify errorRepository.save() is called
    verify(errorRepository, times(1)).save(argThat(twilioError ->
        twilioError.getErrorMessage().equals("Some Error") &&
        twilioError.getSender().equals("+18886710358") &&
        twilioError.getReceiver().equals("receiver1") &&
        twilioError.getContent().equals("Test SMS content")
));

    // Verify returned message SID
    assertEquals("NOT SENT", messageSid);
}
}
@Test
public void testTwilioInit_SendToOne() {
    try (MockedStatic<Twilio> mockedTwilio = mockStatic(Twilio.class)) {
        
        String receiver = "receiver1";
        String content = "Test SMS content";

        twilioSMSService.sendSMSToOne(receiver, content);

        // Verify that Twilio.init was called with the correct arguments
        mockedTwilio.verify(() -> Twilio.init(ACCOUNT_SID, AUTH_TOKEN), times(1));
    }
}

@Test
public void testTwilioInit_SendToAll() {
    try (MockedStatic<Twilio> mockedTwilio = mockStatic(Twilio.class)) {
        
        List<String> receivers = Arrays.asList("receiver1", "receiver2");
        String content = "Test SMS content";

        twilioSMSService.sendSMSToAll(receivers, content);

        // Verify that Twilio.init was called with the correct arguments
        mockedTwilio.verify(() -> Twilio.init(ACCOUNT_SID, AUTH_TOKEN), times(2));
    }
}

}

class MockTwilioSMSService extends TwilioSMSService {

    MessageCreator messageCreator;

    public MockTwilioSMSService(TwilioErrorRepository errorRepository) {
        super(errorRepository);
    }
    
    public void setMessageCreator(MessageCreator messageCreator) {
        this.messageCreator = messageCreator;
    }

    public MessageCreator setMockedMessage(Message mockedMessage) {
        this.messageCreator = mock(MessageCreator.class);
        when(this.messageCreator.create()).thenReturn(mockedMessage);
        
        return this.messageCreator;
    }

}


