package com.ghiffaryr.store.exception;

import com.ghiffaryr.store.enums.ResultEnum;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class InternalServerErrorException extends RuntimeException {

    private Integer code;
    private List<Integer> codes;
    List<String> messages;

    public InternalServerErrorException(String message) {
        super(message);
        this.code = ResultEnum.SERVER_INTERNAL_ERROR.getCode();
    }

    public InternalServerErrorException(ResultEnum resultEnum) {
        super(resultEnum.getMessage());
        this.code = resultEnum.getCode();
    }

    public InternalServerErrorException(Integer code, String message) {
        super(message);
        this.code = code;
    }

    public InternalServerErrorException(List<String> messages) {
        super(messages.toString());
        this.messages = messages;
        this.code = ResultEnum.SERVER_INTERNAL_ERROR.getCode();
    }

    public InternalServerErrorException(List<Integer> codes, List<String> messages) {
        super(messages.toString());
        this.messages = messages;
        this.codes = codes;
    }
    
}
