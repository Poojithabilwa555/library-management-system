package com.library.management.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.library.management.entity.Role;
import com.library.management.entity.User;
import com.library.management.repository.UserRepository;
import com.library.management.security.JwtService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(
            AuthenticationManager authenticationManager,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    // =========================================================
    // REGISTER STUDENT
    // =========================================================
    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody RegisterRequest request) {

        if (userRepository.existsByUsername(request.username())) {

            return ResponseEntity
                    .badRequest()
                    .body("Username already exists");
        }

        User user = new User();

        user.setUsername(request.username());

        user.setPassword(
                passwordEncoder.encode(request.password())
        );

        // Normal registration creates STUDENT accounts
        user.setRole(Role.STUDENT);

        userRepository.save(user);

        return ResponseEntity.ok(
                "Student account created successfully"
        );
    }

    // =========================================================
    // LOGIN
    // =========================================================
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request) {

        try {

            Authentication authentication
                    = authenticationManager.authenticate(
                            new UsernamePasswordAuthenticationToken(
                                    request.username(),
                                    request.password()
                            )
                    );

            User user = userRepository
                    .findByUsername(request.username())
                    .orElseThrow();

            String token = jwtService.generateToken(
                    user.getUsername(),
                    user.getRole().name()
            );

            return ResponseEntity.ok(
                    new LoginResponse(
                            token,
                            user.getUsername(),
                            user.getRole().name()
                    )
            );

        } catch (Exception e) {

            return ResponseEntity
                    .status(401)
                    .body("Invalid username or password");
        }
    }

    // =========================================================
    // REQUEST RECORDS
    // =========================================================
    public record RegisterRequest(
            String username,
            String password
            ) {

    }

    public record LoginRequest(
            String username,
            String password
            ) {

    }

    public record LoginResponse(
            String token,
            String username,
            String role
            ) {

    }
}
