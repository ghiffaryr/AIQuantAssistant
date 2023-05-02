package com.ghiffaryr.store.exception;

import com.ghiffaryr.store.enums.ResultEnum;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class BadRequestException extends RuntimeException{

    private Integer code;
    private List<Integer> codes;
    private List<String> messages;

    public BadRequestException(String message) {
        super(message);
        this.code = ResultEnum.SERVER_BAD_REQUEST_ERROR.getCode();
    }

    public BadRequestException(ResultEnum resultEnum) {
        super(resultEnum.getMessage());
        this.code = resultEnum.getCode();
    }

    public BadRequestException(Integer code, String message) {
        super(message);
        this.code = code;
    }

    public BadRequestException(List<String> messages) {
        super(messages.toString());
        this.messages = messages;
        this.code = ResultEnum.SERVER_BAD_REQUEST_ERROR.getCode();
    }

    public BadRequestException(List<Integer> codes, List<String> messages) {
        super(messages.toString());
        this.messages = messages;
        this.codes = codes;
    }

}
