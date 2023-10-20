package edu.ucsb.cs156.gauchoride.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class GoogleTokenService {

    @Autowired
    OAuth2AuthorizedClientService oAuth2AuthorizedClientService;

    public OAuth2AccessToken getAccessToken(String principalName) {
        log.info("principalName={}", principalName);
        OAuth2AuthorizedClient oAuth2AuthorizedClient = oAuth2AuthorizedClientService.loadAuthorizedClient("google", principalName);
        return oAuth2AuthorizedClient.getAccessToken();
    }

}