package com.kesav.ecommerce.auth;

import com.kesav.ecommerce.user.Role;
import com.kesav.ecommerce.user.User;
import com.kesav.ecommerce.user.UserRepository;
import com.kesav.ecommerce.user.UserService;
import com.kesav.ecommerce.user.impl.UserServiceImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import java.util.Collections;
import static java.util.Collections.singleton;

@RestController
@CrossOrigin
@Tag(name = "Authentication", description = "User login and registration endpoints")
public class AuthController {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
    
    @PostMapping("/login")
    @Operation(summary = "User login", description = "Authenticate user with email and password. Returns JWT token if successful.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Login successful, JWT token returned"),
        @ApiResponse(responseCode = "401", description = "Invalid credentials")
    })
    public String login(@RequestBody User user){

        return userService.verify(user);
    }

    @PostMapping("/register")
    @Operation(summary = "User registration", description = "Register a new user account with email, password, name, and phone")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "User registered successfully"),
        @ApiResponse(responseCode = "400", description = "Email already in use")
    })
    public ResponseEntity<?> register(@RequestBody User request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Email already in use");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(encoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setRole(request.getRole());

        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully");
    }

}
