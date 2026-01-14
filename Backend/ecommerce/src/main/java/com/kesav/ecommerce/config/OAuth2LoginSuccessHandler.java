package com.kesav.ecommerce.config;

import java.io.IOException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.kesav.ecommerce.auth.AuthService;
import com.kesav.ecommerce.user.User;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private AuthService authService;

    @Value("${app.cors.allowed-origins}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        
        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
        
        // Extract user info from OAuth2
        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");
        
        // Remove trailing slash from frontend URL
        String cleanFrontendUrl = frontendUrl.endsWith("/") ? frontendUrl.substring(0, frontendUrl.length() - 1) : frontendUrl;
        
        if (email == null || name == null) {
            response.sendRedirect(cleanFrontendUrl + "/login?error=oauth_failed");
            return;
        }
        
        try {
            // Create or update user and get JWT token
            String jwtToken = authService.createOrUpdateOAuth2User(email, name);
            
            // Get user ID
            Optional<User> user = authService.getUserByEmail(email);
            String userId = user.map(u -> String.valueOf(u.getId())).orElse("");
            
            // Redirect to frontend with token
            String redirectUrl = cleanFrontendUrl + "/oauth2/callback?token=" + jwtToken + "&userId=" + userId;
            response.sendRedirect(redirectUrl);
            
        } catch (Exception e) {
            response.sendRedirect(cleanFrontendUrl + "/login?error=server_error");
        }
    }
}
