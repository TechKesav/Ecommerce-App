package com.kesav.ecommerce.user;

import com.kesav.ecommerce.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<Object> findByRole(String roleUser);
}


