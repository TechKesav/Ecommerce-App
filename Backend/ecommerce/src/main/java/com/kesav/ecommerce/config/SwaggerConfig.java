package com.kesav.ecommerce.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.Components;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Ecommerce API")
                        .version("1.0.0")
                        .description("Ecommerce Platform API with JWT Authentication & OAuth2")
                        .contact(new Contact()
                                .name("Kesav")
                                .url("https://github.com")
                        ))
                .components(new Components()
                        .addSecuritySchemes("Bearer Token", new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("JWT Authentication Token"))
                        .addSecuritySchemes("OAuth2", new SecurityScheme()
                                .type(SecurityScheme.Type.OAUTH2)
                                .flows(new io.swagger.v3.oas.models.security.OAuthFlows()
                                        .implicit(new io.swagger.v3.oas.models.security.OAuthFlow()
                                                .authorizationUrl("https://accounts.google.com/o/oauth2/v2/auth")
                                                .scopes(new io.swagger.v3.oas.models.security.Scopes()
                                                        .addString("openid", "OpenID Connect")
                                                        .addString("profile", "User Profile")
                                                        .addString("email", "User Email")
                                                ))))
                )
                .addSecurityItem(new SecurityRequirement().addList("Bearer Token"))
                .addSecurityItem(new SecurityRequirement().addList("OAuth2"));
    }
}
