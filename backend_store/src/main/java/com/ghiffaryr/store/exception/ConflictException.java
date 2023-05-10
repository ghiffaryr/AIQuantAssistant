package com.ghiffaryr.store.exception;

import com.ghiffaryr.store.enums.ResultEnum;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ConflictException extends RuntimeException{

    private Integer code;
    private List<Integer> codes;
    private List<String> messages;

    public ConflictException(String message) {
        super(message);
        this.code = ResultEnum.SERVER_CONFLICT_ERROR.getCode();
    }

    public ConflictException(ResultEnum resultEnum) {
        super(resultEnum.getMessage());
        this.code = resultEnum.getCode();
    }

    public ConflictException(Integer code, String message) {
        super(message);
        this.code = code;
    }

    public ConflictException(List<String> messages) {
        super(messages.toString());
        this.messages = messages;
        this.code = ResultEnum.SERVER_CONFLICT_ERROR.getCode();
    }

    public ConflictException(List<Integer> codes, List<String> messages) {
        super(messages.toString());
        this.messages = messages;
        this.codes = codes;
    }

}
