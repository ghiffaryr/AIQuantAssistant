package com.ghiffaryr.store.exception;

import com.ghiffaryr.store.enums.ResultEnum;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ForbiddenException extends RuntimeException{

    private Integer code;
    private List<Integer> codes;
    private List<String> messages;

    public ForbiddenException(String message) {
        super(message);
        this.code = ResultEnum.SERVER_FORBIDDEN_ERROR.getCode();
    }

    public ForbiddenException(ResultEnum resultEnum) {
        super(resultEnum.getMessage());
        this.code = resultEnum.getCode();
    }

    public ForbiddenException(Integer code, String message) {
        super(message);
        this.code = code;
    }

    public ForbiddenException(List<String> messages) {
        super(messages.toString());
        this.messages = messages;
        this.code = ResultEnum.SERVER_FORBIDDEN_ERROR.getCode();
    }

    public ForbiddenException(List<Integer> codes, List<String> messages) {
        super(messages.toString());
        this.messages = messages;
        this.codes = codes;
    }

}
