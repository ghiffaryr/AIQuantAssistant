package com.ghiffaryr.store.api;

import com.ghiffaryr.store.dto.request.UserRecoveryForm;
import com.ghiffaryr.store.dto.request.UserRegisterForm;
import com.ghiffaryr.store.dto.request.UserUpdateForm;
import com.ghiffaryr.store.dto.response.ProfileResponse;
import com.ghiffaryr.store.dto.response.UserRecoveryResponse;
import com.ghiffaryr.store.service.UserService;
import com.ghiffaryr.store.dto.request.UserLoginForm;
import com.ghiffaryr.store.dto.response.UserLoginResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;
import java.security.Principal;

@CrossOrigin
@RestController
public class UserController {
    @Autowired
    UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<?> get(Principal principal) {
        return ResponseEntity.ok(userService.profile(principal.getName()));
    }

    @PostMapping("/login")
    public ResponseEntity<UserLoginResponse> login(@RequestBody @Valid UserLoginForm userLoginForm) {
        return ResponseEntity.ok(userService.login(userLoginForm));
    }

    @PostMapping("/register")
    public ResponseEntity<ProfileResponse> register(@RequestBody @Valid UserRegisterForm userRegisterForm) {
        return ResponseEntity.ok(userService.register(userRegisterForm));
    }

    @PatchMapping("/profile/update")
    public ResponseEntity<ProfileResponse> update(@RequestBody @Valid UserUpdateForm userUpdateForm,
                                    Principal principal) {
        return ResponseEntity.ok(userService.update(userUpdateForm, principal.getName()));
    }

    @PutMapping("/recovery")
    public ResponseEntity<UserRecoveryResponse> recovery(@RequestBody @Valid UserRecoveryForm userRecoveryForm) {
        return ResponseEntity.ok(userService.recovery(userRecoveryForm));
    }

    @PatchMapping("/profile/deactivate")
    public ResponseEntity<ProfileResponse> deactivate(Principal principal) {
        return ResponseEntity.ok(userService.deactivate(principal.getName()));
    }
}
