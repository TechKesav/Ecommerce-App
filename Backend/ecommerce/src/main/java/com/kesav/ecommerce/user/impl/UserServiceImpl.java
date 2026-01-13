package com.kesav.ecommerce.user.impl;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.kesav.ecommerce.auth.JWTService;
import com.kesav.ecommerce.user.Role;
import com.kesav.ecommerce.user.User;
import com.kesav.ecommerce.user.UserRepository;
import com.kesav.ecommerce.user.UserService;
import com.kesav.ecommerce.user.UserUpdateRequest;

@Service
public class UserServiceImpl implements UserService {

    private static final Logger log = LoggerFactory.getLogger(UserServiceImpl.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JWTService jwtService;

    @Autowired
    AuthenticationManager authenticationManager;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(12);

    @Override
    public User createUser(User user) {
        // Set default role if not provided
        if (user.getRole() == null) {
            user.setRole(Role.USER);
        }
        return userRepository.save(user);
    }

    @Override
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User updateUser(Long id, User updatedUser) {
        return userRepository.findById(id).map(user -> {
            if (updatedUser.getName() != null) {
                user.setName(updatedUser.getName());
            }
            if (updatedUser.getEmail() != null) {
                user.setEmail(updatedUser.getEmail());
            }
            if (updatedUser.getPhone() != null) {
                user.setPhone(updatedUser.getPhone());
            }
            // DO NOT update role from this method - preserve existing role
            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public User updateUserWithPasswordVerification(Long id, UserUpdateRequest updateRequest) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Verify password before allowing updates
        if (updateRequest.getPassword() == null || updateRequest.getPassword().trim().isEmpty()) {
            throw new BadCredentialsException("Password is required to update user details");
        }

        // Verify the password matches
        if (!passwordEncoder.matches(updateRequest.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid password");
        }

        // Store old email for logging
        String oldEmail = user.getEmail();
        boolean emailChanged = false;

        // Update user details (preserve role)
        if (updateRequest.getName() != null && !updateRequest.getName().trim().isEmpty()) {
            user.setName(updateRequest.getName());
            log.info("✅ User {} changed name to: {}", id, updateRequest.getName());
        }

        if (updateRequest.getEmail() != null && !updateRequest.getEmail().trim().isEmpty()) {
            if (!oldEmail.equals(updateRequest.getEmail())) {
                emailChanged = true;
                user.setEmail(updateRequest.getEmail());
                log.info("✅ User {} changed email from {} to {}", id, oldEmail, updateRequest.getEmail());
                log.info("📧 [MOCK NOTIFICATION] Email verification sent to: {}", updateRequest.getEmail());
                log.info("📧 [MOCK NOTIFICATION] Account update notification sent to old email: {}", oldEmail);
            }
        }

        if (updateRequest.getPhone() != null && !updateRequest.getPhone().trim().isEmpty()) {
            user.setPhone(updateRequest.getPhone());
            log.info("✅ User {} changed phone to: {}", id, updateRequest.getPhone());
        }

        User savedUser = userRepository.save(user);

        if (emailChanged) {
            log.warn("⚠️ User {} must re-login with new email: {}", id, updateRequest.getEmail());
        }

        return savedUser;
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
    @Override
    public String verify(User user) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword())
        );

        if (authentication.isAuthenticated()) {
            User authenticatedUser = userRepository.findByEmail(user.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            return jwtService.generateToken(authenticatedUser.getEmail(), authenticatedUser.getId(),authenticatedUser.getRole());
        }
        return "fail";
    }

}
