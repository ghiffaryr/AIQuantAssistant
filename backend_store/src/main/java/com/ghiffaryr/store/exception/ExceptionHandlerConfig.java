package com.ghiffaryr.store.exception;

import com.ghiffaryr.store.enums.ResultEnum;
import org.json.simple.JSONObject;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.NoHandlerFoundException;

import java.util.*;
import java.util.stream.Collectors;

@RestControllerAdvice
public class ExceptionHandlerConfig {

    @SuppressWarnings("unchecked")
    private JSONObject makeResponse(List<Integer> codes, List<String> messages) {
        JSONObject errorResponse = new JSONObject();
        List<JSONObject> errors = new ArrayList<>();
        Iterator<Integer> codesIterator = codes.iterator();
        Iterator<String> messagesIterator = messages.iterator();
        while(codesIterator.hasNext() && messagesIterator.hasNext()){
            JSONObject error = new JSONObject();
            error.put("code", codesIterator.next());
            error.put("message", messagesIterator.next());
            errors.add(error);
        }
        errorResponse.put("errors", errors);
        return errorResponse;
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
        List<String> messages = ex.getBindingResult().getFieldErrors()
                .stream().map(FieldError::getDefaultMessage).collect(Collectors.toList());
        List<Integer> codes = new ArrayList<>(Collections.nCopies(messages.size(), ResultEnum.VALIDATION_ERROR.getCode()));
        return new ResponseEntity<>(makeResponse(codes, messages), new HttpHeaders(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public final ResponseEntity<?> handleException(Exception ex) {
        List<Integer> codes = Collections.singletonList(ResultEnum.SERVER_INTERNAL_ERROR.getCode());
        List<String> messages = Collections.singletonList(ex.getMessage());
        return new ResponseEntity<>(makeResponse(codes, messages), new HttpHeaders(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(RuntimeException.class)
    public final ResponseEntity<?> handleRuntimeException(RuntimeException ex) {
        List<Integer> codes = Collections.singletonList(ResultEnum.SERVER_INTERNAL_ERROR.getCode());
        List<String> messages = Collections.singletonList(ex.getMessage());
        return new ResponseEntity<>(makeResponse(codes, messages), new HttpHeaders(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(NoHandlerFoundException.class)
    public final ResponseEntity<?> handleNoHandlerFoundException(NoHandlerFoundException ex) {
        List<Integer> codes = Collections.singletonList(ResultEnum.SERVER_NOT_FOUND_ERROR.getCode());
        List<String> messages = Collections.singletonList("The requested URL "+ex.getRequestURL()+" was not found on this server.");
        return new ResponseEntity<>(makeResponse(codes, messages), new HttpHeaders(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(BadRequestException.class)
    public final ResponseEntity<?> handleBadRequestException(BadRequestException ex) {
        List<Integer> codes;
        List<String> messages;
        if (ex.getCodes() != null ) {
            codes = ex.getCodes();
        } else {
            codes = Collections.singletonList(ex.getCode());
        }
        if (ex.getMessages() != null ) {
            messages = ex.getMessages();
        } else {
            messages = Collections.singletonList(ex.getMessage());
        }
        return new ResponseEntity<>(makeResponse(codes, messages), new HttpHeaders(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ForbiddenException.class)
    public final ResponseEntity<?> handleForbiddenException(ForbiddenException ex) {
        List<Integer> codes;
        List<String> messages;
        if (ex.getCodes() != null ) {
            codes = ex.getCodes();
        } else {
            codes = Collections.singletonList(ex.getCode());
        }
        if (ex.getMessages() != null ) {
            messages = ex.getMessages();
        } else {
            messages = Collections.singletonList(ex.getMessage());
        }
        return new ResponseEntity<>(makeResponse(codes, messages), new HttpHeaders(), HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(NotFoundException.class)
    public final ResponseEntity<?> handleNotFoundException(NotFoundException ex) {
        List<Integer> codes;
        List<String> messages;
        if (ex.getCodes() != null ) {
            codes = ex.getCodes();
        } else {
            codes = Collections.singletonList(ex.getCode());
        }
        if (ex.getMessages() != null ) {
            messages = ex.getMessages();
        } else {
            messages = Collections.singletonList(ex.getMessage());
        }
        return new ResponseEntity<>(makeResponse(codes, messages), new HttpHeaders(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ConflictException.class)
    public final ResponseEntity<?> handleConflictException(ConflictException ex) {
        List<Integer> codes;
        List<String> messages;
        if (ex.getCodes() != null ) {
            codes = ex.getCodes();
        } else {
            codes = Collections.singletonList(ex.getCode());
        }
        if (ex.getMessages() != null ) {
            messages = ex.getMessages();
        } else {
            messages = Collections.singletonList(ex.getMessage());
        }
        return new ResponseEntity<>(makeResponse(codes, messages), new HttpHeaders(), HttpStatus.CONFLICT);
    }

    @ExceptionHandler(InternalServerErrorException.class)
    public final ResponseEntity<?> handleInternalServerErrorException(InternalServerErrorException ex) {
        List<Integer> codes;
        List<String> messages;
        if (ex.getCodes() != null ) {
            codes = ex.getCodes();
        } else {
            codes = Collections.singletonList(ex.getCode());
        }
        if (ex.getMessages() != null ) {
            messages = ex.getMessages();
        } else {
            messages = Collections.singletonList(ex.getMessage());
        }
        return new ResponseEntity<>(makeResponse(codes, messages), new HttpHeaders(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

}
