package edu.ucsb.cs156.gauchoride.services;

import edu.ucsb.cs156.gauchoride.services.TwilioSMSService;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.rest.api.v2010.account.MessageCreator;
import com.twilio.Twilio;
import com.twilio.type.PhoneNumber;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

public class TwilioSMSServiceTests {
    @Mock
    private MessageCreator messageCreator;
    
    @Mock
    private TwilioSMSService twilioSMSService;

    @BeforeEach
    public void setUp() {
        twilioSMSService = new TwilioSMSService();
        messageCreator = Mockito.mock(MessageCreator.class);
        Message message = Mockito.mock(Message.class);
        when(message.getSid()).thenReturn("mocked_sid");
        when(messageCreator.create()).thenReturn(message);
        ReflectionTestUtils.setField(twilioSMSService, "messageCreator", messageCreator);
    }

    @Test
    public void testSendSMSToAll() {
        // Arrange
        List<String> receivers = Arrays.asList("+1234567890", "+9876543210");
        String content = "Test SMS Content";

        // Act
        List<String> messageSids = twilioSMSService.sendSMSToAll(receivers, content);

        // Assert
        assertEquals(2, messageSids.size());
        assertEquals("mocked_sid", messageSids.get(0));
        assertEquals("mocked_sid", messageSids.get(1));
    }
}