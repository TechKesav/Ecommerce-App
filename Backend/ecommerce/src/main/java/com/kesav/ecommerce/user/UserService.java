package com.kesav.ecommerce.user;

import com.kesav.ecommerce.user.User;

import java.util.List;
import java.util.Optional;

public interface UserService {
    User createUser(User user);
    Optional<User> getUserById(Long id);
    List<User> getAllUsers();
    User updateUser(Long id, User updatedUser);
    String verify(User user);
    void deleteUser(Long id);
}


