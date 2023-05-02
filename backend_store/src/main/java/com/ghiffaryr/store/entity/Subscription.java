package com.ghiffaryr.store.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.DynamicUpdate;
import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@Entity
@DynamicUpdate
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long subscriptionId;

    @NotBlank(message = "Product category code must not be blank")
    private String productCategoryCode;

    @Email(regexp = "([a-zA-Z0-9]+(?:[._+-][a-zA-Z0-9]+)*)@([a-zA-Z0-9]+(?:[.-][a-zA-Z0-9]+)*[.][a-zA-Z]{2,})",
            message = "Invalid user email address")
    private String userEmail;

    private LocalDateTime expTime;

    public Subscription (String productCategoryCode, User user, LocalDateTime expTime){
        this.productCategoryCode = productCategoryCode;
        this.userEmail = user.getEmail();
        this.expTime = expTime;

    }


}
