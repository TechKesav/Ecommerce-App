package com.kesav.ecommerce.user;

import java.util.List;
import java.util.Optional;

public interface UserService {
    User createUser(User user);
    Optional<User> getUserById(Long id);
    List<User> getAllUsers();
    User updateUser(Long id, User updatedUser);
    User updateUserWithPasswordVerification(Long id, UserUpdateRequest updateRequest);
    String verify(User user);
    void deleteUser(Long id);
}


