package com.kesav.ecommerce.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GoogleOAuth2Request {
    private String email;
    private String name;
    private String googleId;
    private String idToken;
}
