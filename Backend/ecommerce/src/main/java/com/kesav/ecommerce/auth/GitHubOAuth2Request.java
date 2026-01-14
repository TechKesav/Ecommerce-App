package com.kesav.ecommerce.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GitHubOAuth2Request {
    private String email;
    private String login;
    private String githubId;
    private String accessToken;
}
