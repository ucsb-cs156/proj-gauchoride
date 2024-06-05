package edu.ucsb.cs156.gauchoride.config;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;

import edu.ucsb.cs156.gauchoride.config.SecurityConfig.SpaCsrfTokenRequestHandler;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.security.web.csrf.CsrfToken;

public class SecurityConfigTests {

    /**
     * This test helps to fix a mutation testing coverage gap in an inner class of
     * SecurityConfig.
     * We tried to use a pitest exclusion in the pom.xml to avoid having to write
     * this test,
     * but that approach was not successful.
     * 
     * That would be the preferred approach, so if we can find a way to do that,
     * we can eliminate this test.
     */

    @Test
    void test_SpaCsrfTokenRequestHandler() {
        SecurityConfig securityConfig = new SecurityConfig();

        HttpServletRequest request = mock(HttpServletRequest.class);
        CsrfToken csrfToken = mock(CsrfToken.class);
        when(csrfToken.getToken()).thenReturn("csrfToken");
        when(request.getAttribute(CsrfToken.class.getName())).thenReturn(csrfToken);
        when(request.getHeader(any())).thenReturn("csrfToken");

        SpaCsrfTokenRequestHandler spaCsrfTokenRequestHandler = securityConfig.new SpaCsrfTokenRequestHandler();

        String result = spaCsrfTokenRequestHandler.resolveCsrfTokenValue(request, csrfToken);
        assertTrue(result.equals("csrfToken"));
    }
}
