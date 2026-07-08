package com.kesav.ecommerce.auth;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/auth/oauth2")
@Tag(name = "OAuth2 Authentication", description = "OAuth2 login endpoints")
public class OAuth2Controller {

    @Autowired
    private AuthService authService;

    @PostMapping("/google/callback")
    @Operation(summary = "Handle Google OAuth2 callback", description = "Exchange Google OAuth2 code for JWT token")
    public ResponseEntity<?> googleCallback(@RequestBody GoogleOAuth2Request request) {
        try {
            // In real scenario, validate the token with Google servers
            // For now, extract email and create user if not exists
            String email = request.getEmail();
            String name = request.getName();
            
            // Create or update user
            String jwtToken = authService.createOrUpdateOAuth2User(email, name);
            
            return ResponseEntity.ok(new AuthResponse(jwtToken, "Google OAuth2 login successful"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new AuthResponse(null, "OAuth2 login failed: " + e.getMessage()));
        }
    }

    @PostMapping("/github/callback")
    @Operation(summary = "Handle GitHub OAuth2 callback", description = "Exchange GitHub OAuth2 code for JWT token")
    public ResponseEntity<?> githubCallback(@RequestBody GitHubOAuth2Request request) {
        try {
            String email = request.getEmail();
            String name = request.getLogin();
            
            String jwtToken = authService.createOrUpdateOAuth2User(email, name);
            
            return ResponseEntity.ok(new AuthResponse(jwtToken, "GitHub OAuth2 login successful"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new AuthResponse(null, "OAuth2 login failed: " + e.getMessage()));
        }
    }

    @GetMapping("/user")
    @Operation(summary = "Get current OAuth2 authenticated user", description = "Returns the currently authenticated user from OAuth2")
    @SecurityRequirement(name = "Bearer Token")
    public ResponseEntity<?> getOAuth2User(Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof OAuth2User) {
            OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
            return ResponseEntity.ok(oauth2User.getAttributes());
        }
        return ResponseEntity.badRequest().body("User not authenticated via OAuth2");
    }
}
