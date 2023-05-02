package com.ghiffaryr.store.enums;

import lombok.Getter;

@Getter
public enum ProductStatusEnum implements CodeEnum {
    OFFSALE(0, "Unavailable"),
    ONSALE(1, "Available")
    ;
    private Integer code;
    private String message;

    ProductStatusEnum(Integer code, String message) {
        this.code = code;
        this.message = message;
    }

    public String getStatus(Integer code) {

        for(ProductStatusEnum statusEnum : ProductStatusEnum.values()) {
            if (statusEnum.getCode() == code) {
                return statusEnum.getMessage();
            }
        }
        return "";
    }

    public Integer getCode() {
        return code;
    }
}
