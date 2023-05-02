package com.ghiffaryr.store.dto.request;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserUpdateForm {

    private String email;

    private String password;

    private  String name;

    private String image;

    private String phone;

    private String address;

    private Boolean gender;

    private LocalDateTime birthdate;

}
