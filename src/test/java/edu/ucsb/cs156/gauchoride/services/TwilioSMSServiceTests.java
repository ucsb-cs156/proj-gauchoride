package edu.ucsb.cs156.gauchoride.services;

import edu.ucsb.cs156.gauchoride.services.TwilioSMSService;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.rest.api.v2010.account.MessageCreator;
import com.twilio.Twilio;
import com.twilio.type.PhoneNumber;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import static org.mockito.ArgumentMatchers.isA;
import org.mockito.MockitoAnnotations;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.doNothing;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

public class TwilioSMSServiceTests {
    @Mock
    private MessageCreator messageCreator;

    @Mock
    private Message message;

    @Mock
    private Twilio twilio;
    
    @Autowired
    private TwilioSMSService twilioSMSService;

    @Value("${twilio.account.sid:twilio_account_sid_unset}")
    protected String ACCOUNT_SID = "";

    @Value("${twilio.auth.token:twilio_auth_token_unset}")
    protected String AUTH_TOKEN = "";


    @BeforeEach
    public void setUp() {
        //twilioSMSService = new TwilioSMSService();
        //messageCreator = Mockito.mock(MessageCreator.class);
        //message = Mockito.mock(Message.class);
        //when(message.creator(any(PhoneNumber.class), any(PhoneNumber.class), any(String.class))).thenReturn(messageCreator);
        //when(messageCreator.create()).thenReturn(message);
        //when(message.getSid()).thenReturn("mocked_sid");
        //ReflectionTestUtils.setField(twilioSMSService, "messageCreator", messageCreator);
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testSendSMSToAll() {
        // Arrange
        List<String> receivers = Arrays.asList("+1234567890", "+9876543210");
        String content = "Test SMS Content";
        doNothing().when(twilio).init(isA(String.class), isA(String.class));
        //when(message.creator(any(PhoneNumber.class), any(PhoneNumber.class), any(String.class))).thenReturn(messageCreator);
        //when(messageCreator.create()).thenReturn(message);

        // Act
        List<String> messageSids = twilioSMSService.sendSMSToAll(receivers, content);

        // Assert
        verify(twilio, times(1)).init(ACCOUNT_SID, AUTH_TOKEN);
        //assertEquals(2, messageSids.size());
        //assertEquals("mocked_sid", messageSids.get(0));
        //assertEquals("mocked_sid", messageSids.get(1));
    }
}