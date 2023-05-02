package com.ghiffaryr.store.enums;

public enum OrderStatusEnum implements CodeEnum {
    NEW(0, "New Order"),
    FINISHED(1, "Finished"),
    CANCELED(2, "Canceled")
    ;

    private int code;
    private String msg;

    OrderStatusEnum(Integer code, String msg) {
        this.code = code;
        this.msg = msg;
    }

    @Override
    public Integer getCode() {
        return code;
    }
}
