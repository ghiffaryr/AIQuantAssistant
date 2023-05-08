import React from "react";
import Category from "./Category";

export default function CategoryList({ categories }) {
  return (
    <>
      <div className="container mb-3">
        <div
          className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4
        "
          id="categories-row"
        >
          {categories.map((category, idx) => (
            <Category
              key={idx}
              id={category.productCategoryId}
              code={category.productCategoryCode}
              name={category.productCategoryName}
              description={category.productCategoryDescription}
              image={category.productCategoryImage}
              createTime={category.createTime}
              updateTime={category.updateTime}
            />
          ))}
        </div>
      </div>
    </>
  );
}
