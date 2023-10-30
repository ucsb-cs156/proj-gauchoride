package edu.ucsb.cs156.gauchoride.services;

import com.twilio.Twilio;
import com.twilio.converter.Promoter;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import com.twilio.rest.api.v2010.account.MessageCreator;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import java.util.ArrayList;
import java.util.List;
import java.net.URI;
import java.math.BigDecimal;

public interface TwilioClient {
    MessageCreator createMessage(PhoneNumber to, PhoneNumber from, String body);
}