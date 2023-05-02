package com.ghiffaryr.store.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProfileResponse {

    private Long id;
    private String email;
    private String name;
    private String image;
    private String phone;
    private String address;
    private Boolean gender;
    private LocalDateTime birthdate;
    private Boolean active;
    private String role;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
