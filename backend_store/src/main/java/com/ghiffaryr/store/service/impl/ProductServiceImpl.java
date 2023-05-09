package com.ghiffaryr.store.service.impl;

import com.ghiffaryr.store.entity.Product;
import com.ghiffaryr.store.enums.ProductStatusEnum;
import com.ghiffaryr.store.enums.ResultEnum;
import com.ghiffaryr.store.exception.BadRequestException;
import com.ghiffaryr.store.exception.ConflictException;
import com.ghiffaryr.store.exception.NotFoundException;
import com.ghiffaryr.store.repository.ProductRepository;
import com.ghiffaryr.store.service.ProductCategoryService;
import com.ghiffaryr.store.service.ProductService;
import com.ghiffaryr.store.dto.request.ProductForm;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductServiceImpl implements ProductService {
    private static final Logger logger = LoggerFactory.getLogger(ProductServiceImpl.class);

    @Autowired
    ProductRepository productRepository;
    @Autowired
    ProductCategoryService productCategoryService;

    @Override
    public Product find(String productCode) {
        Product product = productRepository.findByProductCode(productCode);
        if (product == null){
            logger.error(ResultEnum.PRODUCT_NOT_FOUND.getMessage());
            throw new NotFoundException(ResultEnum.PRODUCT_NOT_FOUND);
        }
        return product;
    }


    @Override
    public Page<Product> findAll(Pageable pageable) {
        Page<Product> productPage = productRepository.findAllByOrderByProductPeriodAsc(pageable);
        if (productPage.getTotalElements() == 0){
            logger.error(ResultEnum.PRODUCT_NOT_FOUND.getMessage());
            throw new NotFoundException(ResultEnum.PRODUCT_NOT_FOUND);
        }
        return productPage;
    }

    @Override
    public Page<Product> findAllByProductStatus(Integer productStatus, Pageable pageable) {
        Page<Product> productPage = productRepository.findAllByProductStatusOrderByProductPeriodAsc(productStatus, pageable);
        if (productPage.getTotalElements() == 0){
            logger.error(ResultEnum.PRODUCT_NOT_FOUND.getMessage());
            throw new NotFoundException(ResultEnum.PRODUCT_NOT_FOUND);
        }
        return productPage;
    }

    @Override
    public Page<Product> findAllByProductCategoryCode(String productCategoryCode, Pageable pageable) {
        Page<Product> productPage = productRepository.findAllByProductCategoryCodeOrderByProductPeriodAsc(productCategoryCode, pageable);
        if (productPage.getTotalElements() == 0){
            logger.error(ResultEnum.PRODUCT_NOT_FOUND.getMessage());
            throw new NotFoundException(ResultEnum.PRODUCT_NOT_FOUND);
        }
        return productPage;
    }

    @Override
    public Page<Product> findAllByProductStatusAndProductCategoryCode(Integer productStatus, String productCategoryCode, Pageable pageable) {
        Page<Product> productPage = productRepository.findAllByProductStatusAndProductCategoryCodeOrderByProductPeriodAsc(productStatus, productCategoryCode, pageable);
        if (productPage.getTotalElements() == 0){
            logger.error(ResultEnum.PRODUCT_NOT_FOUND.getMessage());
            throw new NotFoundException(ResultEnum.PRODUCT_NOT_FOUND);
        }
        return productPage;
    }

    @Override
    public Page<Product> search(String query, Pageable pageable) {
        Page<Product> productPage = productRepository.search(query, pageable);
        if (productPage.getTotalElements() == 0){
            logger.error(ResultEnum.PRODUCT_NOT_FOUND.getMessage());
            throw new NotFoundException(ResultEnum.PRODUCT_NOT_FOUND);
        }
        return productPage;
    }

    @Override
    public Page<Product> searchByProductStatus(Integer productStatus, String query, Pageable pageable) {
        Page<Product> productPage = productRepository.searchByProductStatus(productStatus, query, pageable);
        if (productPage.getTotalElements() == 0){
            logger.error(ResultEnum.PRODUCT_NOT_FOUND.getMessage());
            throw new NotFoundException(ResultEnum.PRODUCT_NOT_FOUND);
        }
        return productPage;
    }

    @Override
    @Transactional
    public Product offSale(String productCode) {
        Product product = find(productCode);
        if (product.getProductStatus().equals(ProductStatusEnum.OFFSALE.getCode())) {
            logger.error(ResultEnum.PRODUCT_STATUS_INVALID.getMessage());
            throw new BadRequestException(ResultEnum.PRODUCT_STATUS_INVALID);
        }
        product.setProductStatus(ProductStatusEnum.OFFSALE.getCode());
        return productRepository.save(product);
    }

    @Override
    @Transactional
    public Product onSale(String productCode) {
        Product product = find(productCode);
        if (product.getProductStatus().equals(ProductStatusEnum.ONSALE.getCode())) {
            logger.error(ResultEnum.PRODUCT_STATUS_INVALID.getMessage());
            throw new BadRequestException(ResultEnum.PRODUCT_STATUS_INVALID);
        }
        product.setProductStatus(ProductStatusEnum.ONSALE.getCode());
        return productRepository.save(product);
    }

    @Override
    @Transactional
    public Product update(String productCode, ProductForm productForm) {
        Product oldProduct = find(productCode);
        Product isProductCodeExist = productRepository.findByProductCode(productForm.getProductCode());
        if (isProductCodeExist != null && !productCode.equals(productForm.getProductCode())) {
            logger.error(ResultEnum.PRODUCT_EXISTS.getMessage());
            throw new ConflictException(ResultEnum.PRODUCT_EXISTS);
        }
        oldProduct.setProductName(productForm.getProductName());
        oldProduct.setProductDescription(productForm.getProductDescription());
        oldProduct.setProductImage(productForm.getProductImage());
        oldProduct.setProductPeriod(productForm.getProductPeriod());
        oldProduct.setProductPrice(productForm.getProductPrice());
        oldProduct.setProductStatus(productForm.getProductStatus());
        oldProduct.setProductCategoryCode(productForm.getProductCategoryCode());
        return productRepository.save(oldProduct);
    }

    @Override
    @Transactional
    public Product create(ProductForm productForm) {
        Product isProductCodeExist = productRepository.findByProductCode(productForm.getProductCode());
        if (isProductCodeExist != null) {
            logger.error(ResultEnum.PRODUCT_EXISTS.getMessage());
            throw new ConflictException(ResultEnum.PRODUCT_EXISTS);
        }
        Product newProduct = new Product();
        newProduct.setProductCode(productForm.getProductCode());
        newProduct.setProductName(productForm.getProductName());
        newProduct.setProductPrice(productForm.getProductPrice());
        newProduct.setProductPeriod(productForm.getProductPeriod());
        newProduct.setProductDescription(productForm.getProductDescription());
        newProduct.setProductImage(productForm.getProductImage());
        newProduct.setProductStatus(productForm.getProductStatus());
        productCategoryService.find(productForm.getProductCategoryCode());
        newProduct.setProductCategoryCode(productForm.getProductCategoryCode());
        return productRepository.save(newProduct);
    }

    @Override
    @Transactional
    public void delete(String productCode) {
        Product product = find(productCode);
        productRepository.delete(product);
    }
}
