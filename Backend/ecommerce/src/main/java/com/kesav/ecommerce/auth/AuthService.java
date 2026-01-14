package com.kesav.ecommerce.auth;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.kesav.ecommerce.user.Role;
import com.kesav.ecommerce.user.User;
import com.kesav.ecommerce.user.UserRepository;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JWTService jwtService;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    /**
     * Create or update user from OAuth2 provider
     * @param email User email
     * @param name User full name
     * @return JWT token
     */
    public String createOrUpdateOAuth2User(String email, String name) {
        Optional<User> existingUser = userRepository.findByEmail(email);

        User user;
        if (existingUser.isPresent()) {
            // Update existing user
            user = existingUser.get();
            user.setName(name);
            userRepository.save(user);
        } else {
            // Create new user
            user = new User();
            user.setEmail(email);
            user.setName(name);
            user.setRole(Role.USER);
            // Set a random password for OAuth2 users (they won't use it)
            user.setPassword(encoder.encode(email + System.currentTimeMillis()));
            user.setPhone("");
            userRepository.save(user);
        }

        // Generate JWT token
        return jwtService.generateToken(user.getEmail(), user.getId(), user.getRole());
    }

    /**
     * Get user by email
     * @param email User email
     * @return User object if exists
     */
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    /**
     * Check if user exists by email
     * @param email User email
     * @return true if exists
     */
    public boolean isUserExists(String email) {
        return userRepository.existsByEmail(email);
    }
}
