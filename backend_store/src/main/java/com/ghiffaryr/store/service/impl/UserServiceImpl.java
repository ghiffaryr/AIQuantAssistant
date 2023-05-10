package com.ghiffaryr.store.service.impl;

import com.ghiffaryr.store.dto.request.UserRecoverForm;
import com.ghiffaryr.store.dto.request.UserRegisterForm;
import com.ghiffaryr.store.dto.request.UserUpdateForm;
import com.ghiffaryr.store.dto.response.ProfileResponse;
import com.ghiffaryr.store.dto.response.UserRecoverResponse;
import com.ghiffaryr.store.entity.User;
import com.ghiffaryr.store.enums.ResultEnum;
import com.ghiffaryr.store.exception.BadRequestException;
import com.ghiffaryr.store.exception.ConflictException;
import com.ghiffaryr.store.exception.NotFoundException;
import com.ghiffaryr.store.repository.UserRepository;
import com.ghiffaryr.store.security.JWT.JwtProvider;
import com.ghiffaryr.store.security.utils.PasswordUtils;
import com.ghiffaryr.store.service.UserService;
import com.ghiffaryr.store.dto.request.UserLoginForm;
import com.ghiffaryr.store.dto.response.UserLoginResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.DependsOn;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@DependsOn("passwordEncoder")
public class UserServiceImpl implements UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

    @Autowired
    PasswordEncoder passwordEncoder;
    @Autowired
    UserRepository userRepository;
    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    JwtProvider jwtProvider;

    @Override
    public User find(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null){
            logger.error(ResultEnum.USER_NOT_FOUND.getMessage());
            throw new NotFoundException(ResultEnum.USER_NOT_FOUND);
        }
        return user;
    }

    @Override
    public ProfileResponse profile(String email) {
        User user = find(email);
        ProfileResponse profileResponse = new ProfileResponse();
        profileResponse.setId(user.getId());
        profileResponse.setEmail(user.getEmail());
        profileResponse.setName(user.getName());
        profileResponse.setImage(user.getImage());
        profileResponse.setPhone(user.getPhone());
        profileResponse.setAddress(user.getAddress());
        profileResponse.setGender(user.getGender());
        profileResponse.setBirthdate(user.getBirthdate());
        profileResponse.setActive(user.getActive());
        profileResponse.setRole(user.getRole());
        profileResponse.setCreateTime(user.getCreateTime());
        profileResponse.setUpdateTime(user.getUpdateTime());
        return profileResponse;
    }

    @Override
    public UserLoginResponse login(UserLoginForm userLoginForm){
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        userLoginForm.getEmail(), userLoginForm.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtProvider.generate(authentication);

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userRepository.findByEmail(userDetails.getUsername());
        return new UserLoginResponse(jwt, user.getEmail());
    }

    @Override
    @Transactional
    public ProfileResponse register(UserRegisterForm userRegisterForm) {
        User oldUser = userRepository.findByEmail(userRegisterForm.getEmail());
        if (oldUser != null) {
            logger.error(ResultEnum.USER_EXISTS.getMessage());
            throw new ConflictException(ResultEnum.USER_EXISTS);
        }
        User newUser = new User();
        newUser.setEmail(userRegisterForm.getEmail());
        newUser.setPassword(passwordEncoder.encode(userRegisterForm.getPassword()));
        newUser.setName(userRegisterForm.getName());
        newUser.setRecoveryPhrase(passwordEncoder.encode(userRegisterForm.getRecoveryPhrase()));
        newUser.setImage(userRegisterForm.getImage());
        newUser.setPhone(userRegisterForm.getPhone());
        newUser.setAddress(userRegisterForm.getAddress());
        newUser.setGender(userRegisterForm.getGender());
        newUser.setBirthdate(userRegisterForm.getBirthdate());
        newUser.setRole(userRegisterForm.getRole());
        userRepository.save(newUser);
        return profile(newUser.getEmail());
    }

    @Override
    @Transactional
    public ProfileResponse update(UserUpdateForm userUpdateForm, String principalName) {
        User isEmailExist = userRepository.findByEmail(userUpdateForm.getEmail());
        if (isEmailExist != null && !principalName.equals(userUpdateForm.getEmail())) {
            logger.error(ResultEnum.USER_EMAIL_USED.getMessage());
            throw new ConflictException(ResultEnum.USER_EMAIL_USED);
        }
        User oldUser = userRepository.findByEmail(principalName);
        if (userUpdateForm.getEmail() != null) {
            if (!userUpdateForm.getEmail().matches("([a-zA-Z0-9]+(?:[._+-][a-zA-Z0-9]+)*)@([a-zA-Z0-9]+(?:[.-][a-zA-Z0-9]+)*[.][a-zA-Z]{2,})")) {
                logger.error(ResultEnum.USER_EMAIL_INVALID.getMessage());
                throw new BadRequestException(ResultEnum.USER_EMAIL_INVALID);
            }
            oldUser.setEmail(userUpdateForm.getEmail());
        }
        if (userUpdateForm.getPassword() != null) {
            if (!userUpdateForm.getPassword().matches("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^A-Za-z0-9]).{8,}$")) {
                logger.error(ResultEnum.USER_PASSWORD_INVALID.getMessage());
                throw new BadRequestException(ResultEnum.USER_PASSWORD_INVALID);
            }
            oldUser.setPassword(passwordEncoder.encode(userUpdateForm.getPassword()));
        }
        if (userUpdateForm.getName() != null) oldUser.setName(userUpdateForm.getName());
        if (userUpdateForm.getImage() != null) oldUser.setImage(userUpdateForm.getImage());
        if (userUpdateForm.getPhone() != null) oldUser.setPhone(userUpdateForm.getPhone());
        if (userUpdateForm.getAddress() != null) oldUser.setAddress(userUpdateForm.getAddress());
        if (userUpdateForm.getGender() != null) oldUser.setGender(userUpdateForm.getGender());
        if (userUpdateForm.getBirthdate() != null) oldUser.setBirthdate(userUpdateForm.getBirthdate());
        userRepository.save(oldUser);

        return profile(oldUser.getEmail());
    }

    @Override
    @Transactional
    public UserRecoverResponse recover(UserRecoverForm userRecoverForm) {
        User oldUser = find(userRecoverForm.getEmail());
        if (!passwordEncoder.matches(userRecoverForm.getRecoveryPhrase(), oldUser.getRecoveryPhrase())){
            logger.error(ResultEnum.USER_RECOVERY_PHRASE_WRONG.getMessage());
            throw new BadRequestException(ResultEnum.USER_RECOVERY_PHRASE_WRONG);
        }
        String generatedPassword = PasswordUtils.generatePassword(8);
        oldUser.setPassword(passwordEncoder.encode(generatedPassword));
        userRepository.save(oldUser);

        UserRecoverResponse userRecoverResponse = new UserRecoverResponse();
        userRecoverResponse.setEmail(oldUser.getEmail());
        userRecoverResponse.setPassword(generatedPassword);
        return userRecoverResponse;
    }

    @Override
    @Transactional
    public ProfileResponse deactivate(String principalName) {
        User oldUser = userRepository.findByEmail(principalName);
        oldUser.setActive(false);
        userRepository.save(oldUser);
        return profile(oldUser.getEmail());
    }
}
