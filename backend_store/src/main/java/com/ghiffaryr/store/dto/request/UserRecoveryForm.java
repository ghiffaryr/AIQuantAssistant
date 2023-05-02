package com.ghiffaryr.store.dto.request;

import lombok.Data;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
@Data
public class UserRecoveryForm {

    @Email(regexp = "([a-zA-Z0-9]+(?:[._+-][a-zA-Z0-9]+)*)@([a-zA-Z0-9]+(?:[.-][a-zA-Z0-9]+)*[.][a-zA-Z]{2,})",
            message = "Invalid email address")
    private String email;
    
    @NotBlank(message = "Recovery phrase must not be blank")
    private String recoveryPhrase;
    
}
