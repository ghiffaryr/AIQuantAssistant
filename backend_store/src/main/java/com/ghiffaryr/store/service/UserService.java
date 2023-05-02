package com.ghiffaryr.store.service;

import com.ghiffaryr.store.dto.request.UserRecoveryForm;
import com.ghiffaryr.store.dto.request.UserRegisterForm;
import com.ghiffaryr.store.dto.request.UserUpdateForm;
import com.ghiffaryr.store.dto.response.ProfileResponse;
import com.ghiffaryr.store.dto.response.UserRecoveryResponse;
import com.ghiffaryr.store.entity.User;
import com.ghiffaryr.store.dto.request.UserLoginForm;
import com.ghiffaryr.store.dto.response.UserLoginResponse;

public interface UserService {

    User find(String email);

    ProfileResponse profile(String email);

    UserLoginResponse login(UserLoginForm userLoginForm);

    ProfileResponse register(UserRegisterForm userRegisterForm);

    ProfileResponse update(UserUpdateForm userUpdateForm, String principalName);

    UserRecoveryResponse recovery(UserRecoveryForm userRecoveryForm);

    ProfileResponse deactivate(String principalName);

}
