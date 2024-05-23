package com.ghiffaryr.store.service.impl;

import com.ghiffaryr.store.dto.request.PredictForm;
import com.ghiffaryr.store.entity.ProductCategory;
import com.ghiffaryr.store.entity.Subscription;
import com.ghiffaryr.store.enums.ResultEnum;
import com.ghiffaryr.store.exception.*;
import com.ghiffaryr.store.repository.ProductCategoryRepository;
import com.ghiffaryr.store.service.ProductCategoryService;
import com.ghiffaryr.store.dto.request.ProductCategoryForm;
import com.ghiffaryr.store.service.SubscriptionService;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ProductCategoryServiceImpl implements ProductCategoryService {
    private static final Logger logger = LoggerFactory.getLogger(ProductCategoryServiceImpl.class);

    @Autowired
    ProductCategoryRepository productCategoryRepository;
    @Autowired
    SubscriptionService subscriptionService;

    JSONParser jsonParser = new JSONParser();

    @Override
    public ProductCategory find(String productCategoryCode) {
        ProductCategory productCategory = productCategoryRepository.findByProductCategoryCode(productCategoryCode);
        if (productCategory == null){
            logger.error(ResultEnum.CATEGORY_NOT_FOUND.getMessage());
            throw new NotFoundException(ResultEnum.CATEGORY_NOT_FOUND);
        }
        return productCategory;
    }

    @Override
    public Page<ProductCategory> findAll(Pageable pageable) {
        Page<ProductCategory> productCategory = productCategoryRepository.findAllByOrderByProductCategoryCodeAsc(pageable);
        if (productCategory.getTotalElements() == 0){
            logger.error(ResultEnum.CATEGORY_NOT_FOUND.getMessage());
            throw new NotFoundException(ResultEnum.CATEGORY_NOT_FOUND);
        }
        return productCategory;
    }

    @Override
    @Transactional
    public ProductCategory update(String productCategoryCode, ProductCategoryForm productCategoryForm) {
        ProductCategory oldProductCategory = find(productCategoryCode);
        ProductCategory isCategoryCodeExist = productCategoryRepository.findByProductCategoryCode(productCategoryForm.getProductCategoryCode());
        if (isCategoryCodeExist != null && !productCategoryCode.equals(productCategoryForm.getProductCategoryCode())) {
            logger.error(ResultEnum.CATEGORY_EXISTS.getMessage());
            throw new ConflictException(ResultEnum.CATEGORY_EXISTS);
        }
        oldProductCategory.setProductCategoryCode(productCategoryForm.getProductCategoryCode());
        oldProductCategory.setProductCategoryName(productCategoryForm.getProductCategoryName());
        oldProductCategory.setProductCategoryDescription(productCategoryForm.getProductCategoryDescription());
        oldProductCategory.setProductCategoryImage(productCategoryForm.getProductCategoryImage());
        return productCategoryRepository.save(oldProductCategory);
    }

    @Override
    @Transactional
    public ProductCategory create(ProductCategoryForm productCategoryForm) {
        ProductCategory isCategoryCodeExist = productCategoryRepository.findByProductCategoryCode(productCategoryForm.getProductCategoryCode());
        if (isCategoryCodeExist != null) {
            logger.error(ResultEnum.CATEGORY_EXISTS.getMessage());
            throw new ConflictException(ResultEnum.CATEGORY_EXISTS);
        }
        ProductCategory newProductCategory = new ProductCategory();
        newProductCategory.setProductCategoryCode(productCategoryForm.getProductCategoryCode());
        newProductCategory.setProductCategoryName(productCategoryForm.getProductCategoryName());
        newProductCategory.setProductCategoryDescription(productCategoryForm.getProductCategoryDescription());
        newProductCategory.setProductCategoryImage(productCategoryForm.getProductCategoryImage());
        return productCategoryRepository.save(newProductCategory);
    }

    @Override
    @Transactional
    public void delete(String productCategoryCode) {
        ProductCategory productCategory = find(productCategoryCode);
        productCategoryRepository.delete(productCategory);
    }

    @Override
    @SuppressWarnings("unchecked")
    public String predict(String forecastApi, String sentimentApi, String topicApi, String summaryApi, String productCategoryCode, PredictForm predictForm, String authenticationEmail, Boolean isCustomer){
        String targetApi = "";
        JSONObject requestJsonObject = new JSONObject();
        if (productCategoryCode.startsWith("forecast")){
            targetApi = forecastApi;
            System.out.println("Target API: " + targetApi);
            requestJsonObject.put("stock_code", predictForm.getStockCode());
            requestJsonObject.put("training_window", predictForm.getTrainingWindow());
            requestJsonObject.put("model_choice", productCategoryCode.substring(9));
            requestJsonObject.put("forecasting_horizon", predictForm.getForecastingHorizon());
            System.out.println(requestJsonObject);
        } else if (productCategoryCode.equals("text_sentiment")){
            targetApi = sentimentApi;
            System.out.println("Target API: " + targetApi);
            requestJsonObject.put("input", predictForm.getInput());
            System.out.println(requestJsonObject);
        } else if (productCategoryCode.startsWith("text_topic")){
            targetApi = topicApi;
            System.out.println("Target API: " + targetApi);
            requestJsonObject.put("input", predictForm.getInput());
            System.out.println(requestJsonObject);
        } else if (productCategoryCode.startsWith("text_summary")){
            targetApi = summaryApi;
            System.out.println("Target API: " + targetApi);
            requestJsonObject.put("input", predictForm.getInput());
            System.out.println(requestJsonObject);
        }
        

        if (isCustomer){
            Subscription subscription = subscriptionService.findByUserEmailAndProductCategoryCode(authenticationEmail, productCategoryCode, true);
            if(subscription == null || !subscription.getExpTime().isAfter(LocalDateTime.now())) {
                logger.error(ResultEnum.SUBSCRIPTION_INACTIVE.getMessage());
                throw new ForbiddenException(ResultEnum.SUBSCRIPTION_INACTIVE);
            }
        }

        HttpURLConnection con = null;
        try {
            URL myurl = new URL(targetApi);
            con = (HttpURLConnection) myurl.openConnection();

            con.setDoOutput(true);
            con.setRequestMethod("POST");
            con.setRequestProperty("User-Agent", "Java Client");
            con.setRequestProperty("Content-Type", "application/json");

            try (DataOutputStream wr = new DataOutputStream(con.getOutputStream())) {
                wr.write(requestJsonObject.toString().getBytes());
            }

            int responseCode = con.getResponseCode();
            BufferedReader br;
            if (responseCode == 200) {
                br = new BufferedReader(new InputStreamReader(con.getInputStream()));
            } else {
                br = new BufferedReader(new InputStreamReader(con.getErrorStream()));
            }

            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = br.readLine()) != null) {
                sb.append(line).append(System.lineSeparator());
            }
            String responseBody = sb.toString();
            System.out.println("Response body: "+responseBody);
            if (responseCode == 200) {
                return responseBody;
            } else {
                try {
                    JSONObject responseBodyJsonObject = (JSONObject) jsonParser.parse(responseBody);
                    JSONArray responseBodyErrors = (JSONArray) responseBodyJsonObject.get("errors");
                    List<Integer> responseBodyErrorCodes = new ArrayList<>();
                    List<String> responseBodyErrorMessages = new ArrayList<>();
                    for (Object responseBodyErrorObject : responseBodyErrors) {
                        JSONObject responseBodyError = (JSONObject) responseBodyErrorObject;
                        responseBodyErrorCodes.add(Integer.valueOf(responseBodyError.get("code").toString()));
                        responseBodyErrorMessages.add(responseBodyError.get("message").toString());
                    }
                    if (responseCode == 400) {
                        logger.error(responseBodyErrorMessages.toString());
                        throw new BadRequestException(responseBodyErrorCodes, responseBodyErrorMessages);
                    } else if (responseCode == 401) {
                        logger.error(responseBodyErrorMessages.toString());
                        throw new ForbiddenException(responseBodyErrorCodes, responseBodyErrorMessages);
                    } else if (responseCode == 404) {
                        logger.error(responseBodyErrorMessages.toString());
                        throw new NotFoundException(responseBodyErrorCodes, responseBodyErrorMessages);
                    } else {
                        logger.error(responseBodyErrorMessages.toString());
                        throw new InternalServerErrorException(responseBodyErrorCodes, responseBodyErrorMessages);
                    }
                } catch (ParseException e) {
                    if (responseCode == 400){
                        logger.error(responseBody);
                        throw new BadRequestException(responseBody);
                    } else if (responseCode == 401) {
                        logger.error(responseBody);
                        throw new ForbiddenException(responseBody);
                    } else if (responseCode == 404) {
                        logger.error(responseBody);
                        throw new NotFoundException(responseBody);
                    } else {
                        logger.error(responseBody);
                        throw new InternalServerErrorException(responseBody);
                    }
                }
            }
        } catch (IOException e) {
            logger.error(e.getMessage());
            throw new InternalServerErrorException(e.getMessage());
        } finally {
            if (con != null) {
                con.disconnect();
            }
        }
    }

}
