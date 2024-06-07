package edu.ucsb.cs156.gauchoride.testconfig;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;

import edu.ucsb.cs156.gauchoride.config.SecurityConfig;
import edu.ucsb.cs156.gauchoride.services.CurrentUserService;
import edu.ucsb.cs156.gauchoride.services.GrantedAuthoritiesService;

@TestConfiguration
@Import(SecurityConfig.class)
public class TestConfig {

    @Bean
    public CurrentUserService currentUserService() {
        return new MockCurrentUserServiceImpl();
    }

    @Bean
    public GrantedAuthoritiesService grantedAuthoritiesService() {
        return new GrantedAuthoritiesService();
    }
}
