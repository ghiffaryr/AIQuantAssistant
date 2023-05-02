package com.ghiffaryr.store.dto.response;

import com.ghiffaryr.store.entity.Product;
import lombok.*;
import org.springframework.data.domain.Page;
import java.time.LocalDateTime;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductCategoryPage {

    private String productCategoryName;
    private String productCategoryCode;
    private String productCategoryDescription;
    private String productCategoryImage;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
    private Page<Product> page;

}