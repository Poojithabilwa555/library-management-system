package com.library.management.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter) {

        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration)
            throws Exception {

        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http)
            throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {
                })
                .sessionManagement(session
                        -> session.sessionCreationPolicy(
                        SessionCreationPolicy.STATELESS
                )
                )
                .authorizeHttpRequests(auth -> auth
                // Authentication APIs
                .requestMatchers(
                        "/api/auth/**"
                ).permitAll()
                // Public book viewing
                .requestMatchers(
                        org.springframework.http.HttpMethod.GET,
                        "/api/books/**"
                ).hasAnyRole("STUDENT", "LIBRARIAN")
                // Librarian-only book management
                .requestMatchers(
                        org.springframework.http.HttpMethod.POST,
                        "/api/books/**"
                ).hasRole("LIBRARIAN")
                .requestMatchers(
                        org.springframework.http.HttpMethod.PUT,
                        "/api/books/**"
                ).hasRole("LIBRARIAN")
                .requestMatchers(
                        org.springframework.http.HttpMethod.DELETE,
                        "/api/books/**"
                ).hasRole("LIBRARIAN")
                // Members
                .requestMatchers(
                        org.springframework.http.HttpMethod.GET,
                        "/api/members/**"
                ).hasAnyRole("STUDENT", "LIBRARIAN")
                .requestMatchers(
                        org.springframework.http.HttpMethod.POST,
                        "/api/members/**"
                ).hasRole("LIBRARIAN")
                .requestMatchers(
                        org.springframework.http.HttpMethod.PUT,
                        "/api/members/**"
                ).hasRole("LIBRARIAN")
                .requestMatchers(
                        org.springframework.http.HttpMethod.DELETE,
                        "/api/members/**"
                ).hasRole("LIBRARIAN")
                // Borrowing
                .requestMatchers(
                        org.springframework.http.HttpMethod.GET,
                        "/api/borrowings/**"
                ).hasAnyRole("STUDENT", "LIBRARIAN")
                .requestMatchers(
                        org.springframework.http.HttpMethod.POST,
                        "/api/borrowings/**"
                ).hasAnyRole("STUDENT", "LIBRARIAN")
                .requestMatchers(
                        org.springframework.http.HttpMethod.PUT,
                        "/api/borrowings/**"
                ).hasAnyRole("STUDENT", "LIBRARIAN")
                .requestMatchers(
                        org.springframework.http.HttpMethod.DELETE,
                        "/api/borrowings/**"
                ).hasRole("LIBRARIAN")
                // Everything else
                .anyRequest().authenticated()
                )
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}
