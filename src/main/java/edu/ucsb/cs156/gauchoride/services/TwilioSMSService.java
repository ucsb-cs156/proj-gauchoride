package edu.ucsb.cs156.gauchoride.services;

import com.twilio.Twilio;
import com.twilio.converter.Promoter;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import java.util.ArrayList;


import java.net.URI;
import java.math.BigDecimal;

@Service
public class TwilioSMSService {
    // Find your Account Sid and Token at twilio.com/console
    @Value("${twilio.account.sid:twilio_account_sid_unset}")
    private String ACCOUNT_SID = "";

    @Value("${twilio.auth.token:twilio_auth_token_unset}")
    private String AUTH_TOKEN = "";

    public void sendSMSToAll(Iterable<String> receivers, String content) {
        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);

        Iterable<String> messageSids = new ArrayList<>();

        for (String receiver : receivers) {
            Message message = Message.creator(
                    new PhoneNumber(receiver),
                    new PhoneNumber("+18886710358"),
                    content
            ).create();
           message.getSid();
        }
    }
}



