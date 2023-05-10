package com.ghiffaryr.store.exception;

import com.ghiffaryr.store.enums.ResultEnum;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class NotFoundException extends RuntimeException {

    private Integer code;
    private List<Integer> codes;
    private List<String> messages;

    public NotFoundException(String message) {
        super(message);
        this.code = ResultEnum.SERVER_NOT_FOUND_ERROR.getCode();
    }

    public NotFoundException(ResultEnum resultEnum) {
        super(resultEnum.getMessage());
        this.code = resultEnum.getCode();
    }

    public NotFoundException(Integer code, String message) {
        super(message);
        this.code = code;
    }

    public NotFoundException(List<String> messages) {
        super(messages.toString());
        this.messages = messages;
        this.code = ResultEnum.SERVER_NOT_FOUND_ERROR.getCode();
    }

    public NotFoundException(List<Integer> codes, List<String> messages) {
        super(messages.toString());
        this.messages = messages;
        this.codes = codes;
    }
    
}
