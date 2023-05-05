package com.ghiffaryr.store.enums;

import lombok.Getter;

@Getter
public enum ResultEnum {

    VALIDATION_ERROR(0, "Validation error!"),

    SERVER_BAD_REQUEST_ERROR(400, "Server bad request exception error!"),
    SERVER_FORBIDDEN_ERROR(403, "Server forbidden exception error!"),
    SERVER_NOT_FOUND_ERROR(404, "Server not found exception error!"),
    SERVER_CONFLICT_ERROR(409, "Server conflict exception error!"),
    SERVER_INTERNAL_ERROR(500, "Server internal exception error!"),

    PRODUCT_NOT_FOUND(10, "Product does not exist!"),
    PRODUCT_EXISTS(11, "Product already exists!"),
    PRODUCT_STATUS_INVALID(12, "Product status invalid!"),

    CART_IS_EMPTY(20, "Cart is empty!"),
    CART_MERGE_FAILED(21, "Cart merge failed!"),

    CATEGORY_NOT_FOUND(30, "Category does not exist!"),
    CATEGORY_EXISTS(31, "Category already exists!"),

    ORDER_NOT_FOUND(40, "Order does not exist!"),
    ORDER_STATUS_INVALID(41, "Order status invalid!"),

    ORDER_DETAIL_NOT_FOUND(50, "Order detail does not exist!"),

    SUBSCRIPTION_NOT_FOUND(60, "Subscription does not exist!"),
    SUBSCRIPTION_INACTIVE(61, "Subscription not active!"),

    USER_NOT_FOUND(80,"User is not found!"),
    USER_EXISTS(81, "User already exists!"),
    USER_EMAIL_USED(82, "Email has been used!"),
    USER_EMAIL_INVALID(83, "Invalid email address"),
    USER_PASSWORD_INVALID(84, "Password must be at least 8 characters long containing at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character"),
    USER_NO_ACCESS(85, "User has no right to access!"),
    USER_RECOVERY_PHRASE_WRONG(86, "Wrong user recovery phrase!")
    ;

    private Integer code;
    private String message;

    ResultEnum(Integer code, String message) {
        this.code = code;
        this.message = message;
    }
}
