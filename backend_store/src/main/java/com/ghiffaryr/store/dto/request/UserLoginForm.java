package com.ghiffaryr.store.dto.request;

import lombok.Data;
import javax.validation.constraints.Email;

@Data
public class UserLoginForm {

    @Email(regexp = "([a-zA-Z0-9]+(?:[._+-][a-zA-Z0-9]+)*)@([a-zA-Z0-9]+(?:[.-][a-zA-Z0-9]+)*[.][a-zA-Z]{2,})",
            message = "Invalid email address")
    private String email;
    private String password;

}
