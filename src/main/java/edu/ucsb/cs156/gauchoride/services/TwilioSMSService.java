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
import org.springframework.beans.factory.annotation.Autowired;

@Service
public class TwilioSMSService {
    @Value("${twilio.account.sid:twilio_account_sid_unset}")
    protected String ACCOUNT_SID = "";

    @Value("${twilio.auth.token:twilio_auth_token_unset}")
    protected String AUTH_TOKEN = "";

    private final TwilioClient twilioClient;

    @Autowired
    public TwilioSMSService(TwilioClient twilioClient) {
        this.twilioClient = twilioClient;
    }

    public List<String> sendSMSToAll(Iterable<String> receivers, String content) {
        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);
        
        List<String> messageSids = new ArrayList<>();

        for (String receiver : receivers) {
            PhoneNumber to = new PhoneNumber(receiver);
            PhoneNumber from = new PhoneNumber("+18886710358");
            MessageCreator messageCreator = twilioClient.createMessage(to, from, content);
            Message message = messageCreator.create();
            messageSids.add(message.getSid());
        }

        return messageSids;
    }
}



