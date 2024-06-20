/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import Product from './Product';
import { ProductDataType } from '@/type/ProductDataType';

export default function ProductList({
  products,
  setProducts,
  getCartRefetch,
}: ProductListProps) {
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
              id={product.productId!}
              categoryCode={product.productCategoryCode}
              code={product.productCode!}
              name={product.productName}
              price={product.productPrice!}
              period={product.productPeriod!}
              description={product.productDescription}
              image={product.productImage}
              status={product.productStatus!}
              createTime={product.createTime}
              updateTime={product.updateTime}
              products={products}
              setProducts={setProducts}
              getCartRefetch={getCartRefetch}
            />
          ))}
        </div>
      </div>
    </>
  );
}

type ProductListProps = {
  products: ProductDataType[];
  setProducts: React.Dispatch<React.SetStateAction<ProductDataType[]>>;
  getCartRefetch: () => Promise<any>;
};
