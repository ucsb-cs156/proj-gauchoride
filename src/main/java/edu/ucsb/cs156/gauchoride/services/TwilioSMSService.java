package edu.ucsb.cs156.gauchoride.services;

import com.twilio.Twilio;
import com.twilio.converter.Promoter;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import java.util.ArrayList;
import java.util.List;
import java.net.URI;
import java.math.BigDecimal;

import edu.ucsb.cs156.gauchoride.repositories.TwilioErrorRepository;
import edu.ucsb.cs156.gauchoride.entities.TwilioError;

@Service
public class TwilioSMSService {
    // Find your Account Sid and Token at twilio.com/console
    @Value("${twilio.account.sid:twilio_account_sid_unset}")
    protected String ACCOUNT_SID = "";

    @Value("${twilio.auth.token:twilio_auth_token_unset}")
    protected String AUTH_TOKEN = "";

    private TwilioErrorRepository errorRepository;

    public TwilioSMSService(TwilioErrorRepository errorRepository) {
        this.errorRepository = errorRepository;
    }

    public List<String> sendSMSToAll(Iterable<String> receivers, String content) {
        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);

        List<String> messageSids = new ArrayList<>();

        for (String receiver : receivers) {
            messageSids.add(sendSMSToOne(receiver, content));
        }
        return messageSids;
    }


    public String sendSMSToOne(String receiver, String content) {
        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);
        
        String messageSid = "NOT SENT";

        try {
            Message message = Message.creator(
                    new PhoneNumber(receiver),
                    new PhoneNumber("+18886710358"),
                    content
            ).create();
            messageSid = message.getSid();
        } catch (Exception e) {
            TwilioError twilioError = new TwilioError();
            twilioError.setContent(content);
            twilioError.setReceiver(receiver);
            twilioError.setSender("+18886710358");
            twilioError.setErrorMessage(e.getMessage());
            errorRepository.save(twilioError);
        }
        return messageSid;
    }


}


