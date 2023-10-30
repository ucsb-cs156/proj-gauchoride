package edu.ucsb.cs156.gauchoride.services;

import edu.ucsb.cs156.gauchoride.services.TwilioSMSService;
import edu.ucsb.cs156.gauchoride.services.TwilioClient;

import com.twilio.rest.api.v2010.account.Message;
import com.twilio.rest.api.v2010.account.MessageCreator;
import com.twilio.Twilio;
import com.twilio.type.PhoneNumber;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import static org.mockito.ArgumentMatchers.isA;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.doNothing;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.*;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(SpringExtension.class)
public class TwilioSMSServiceTests {

    @Mock
    private MessageCreator messageCreator;

    @Mock
    private Message message;

    @Mock
    private Twilio twilio;

    @Autowired
    private TwilioSMSService twilioSMSService;

    @MockBean
    private TwilioClient twilioClient;

    @Test
    public void testSendSMSToAll() {
        //twilioSMSService = new TwilioSMSService();
        messageCreator = Mockito.mock(MessageCreator.class);
        message = Mockito.mock(Message.class);

        when(message.getSid())
            .thenReturn("MOCK_SID");
        when(messageCreator.create())
            .thenReturn(message);
        when(twilioClient.createMessage(any(), any(), any()))
            .thenReturn(messageCreator);
    

        // Define test data
        Iterable<String> receivers = Arrays.asList("+1234567890", "+9876543210");
        String content = "Test SMS Content";

        // act
        List<String> messageSids = twilioSMSService.sendSMSToAll(receivers, content);

        // Verify
        assertEquals("MOCK_SID", messageSids.get(0));
        assertEquals("MOCK_SID", messageSids.get(1));
    }
}


