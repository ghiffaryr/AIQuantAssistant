package com.ghiffaryr.store.dto.request;

import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import java.time.LocalDateTime;

@Data
public class UserRegisterForm {

    @Email(regexp = "([a-zA-Z0-9]+(?:[._+-][a-zA-Z0-9]+)*)@([a-zA-Z0-9]+(?:[.-][a-zA-Z0-9]+)*[.][a-zA-Z]{2,})",
            message = "Invalid email address")
    private String email;
    @Pattern(regexp = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$",
            message = "Password must be at least 8 characters long containing at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character")
    private String password;
    @NotBlank(message = "Name must not be blank")
    private String name;
    @NotBlank(message = "Recovery phrase must not be blank")
    private String recoveryPhrase;

    private String image;

    private String phone;

    private String address;

    private Boolean gender;

    private LocalDateTime birthdate;

    @NotBlank(message = "Role must not be blank")
    private String role = "ROLE_CUSTOMER";

}
