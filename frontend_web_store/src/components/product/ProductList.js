import React from "react";
import Product from "./Product";

export default function ProductList({
  cartOrderDetailCount,
  setCartOrderDetailCount,
  products,
  getProducts,
}) {
  return (
    <>
      <div className="container mt-3 mb-3">
        <div
          className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4
        "
          id="products-row"
        >
          {products.map((product) => (
            <Product
              cartOrderDetailCount={cartOrderDetailCount}
              setCartOrderDetailCount={setCartOrderDetailCount}
              key={product.productId}
              id={product.productId}
              code={product.productCode}
              name={product.productName}
              price={product.productPrice}
              period={product.productPeriod}
              description={product.productDescription}
              image={product.productImage}
              status={product.productStatus}
              createTime={product.createTime}
              updateTime={product.updateTime}
              getProducts={product.getProducts}
            />
          ))}
        </div>
      </div>
    </>
  );
}
