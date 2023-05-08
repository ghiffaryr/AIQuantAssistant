import React from "react";
import Product from "./Product";

export default function ProductList({ products, setCartOrderDetailCount }) {
  return (
    <>
      <div className="container mb-3">
        <div
          className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4
        "
          id="products-row"
        >
          {products.map((product, idx) => (
            <Product
              key={idx}
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
              setCartOrderDetailCount={setCartOrderDetailCount}
            />
          ))}
        </div>
      </div>
    </>
  );
}
