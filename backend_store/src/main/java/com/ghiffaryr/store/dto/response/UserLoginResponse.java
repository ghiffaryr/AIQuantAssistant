package com.ghiffaryr.store.dto.response;

import lombok.Data;

@Data
public class UserLoginResponse {
    private String token;
    private String type = "Bearer";
    private String email;

    public UserLoginResponse(String token, String email) {
        this.email = email;
        this.token = token;
    }
}
