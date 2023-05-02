package com.ghiffaryr.store.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.UpdateTimestamp;
import javax.persistence.*;
import javax.validation.constraints.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@Entity
@DynamicUpdate
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

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

    private Boolean active = true;
    @NotBlank(message = "Role must not be blank")
    private String role = "ROLE_CUSTOMER";

    @CreationTimestamp
    private LocalDateTime createTime;

    @UpdateTimestamp
    private LocalDateTime updateTime;

    @OneToOne(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonIgnore
    private Cart cart;
    
    User(String email,
         String password,
         String name,
         String image,
         String phone,
         String address,
         Boolean gender,
         LocalDateTime birthdate,
         Boolean active,
         String role){
        this.email = email;
        this.password = password;
        this.name = name;
        this.image = image;
        this.phone = phone;
        this.address = address;
        this.gender = gender;
        this.birthdate = birthdate;
        this.active = active;
        this.role = role;
    }
}