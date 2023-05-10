import React from "react";
import Category from "./Category";

export default function CategoryList({ categories, setCategories }) {
  return (
    <>
      <div className="container mb-3">
        {localStorage.getItem("userRole") === "ROLE_EMPLOYEE" ||
        localStorage.getItem("userRole") === "ROLE_MANAGER" ? (
          <div
            className="row row-cols-1 g-4
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
                categories={categories}
                setCategories={setCategories}
              />
            ))}
          </div>
        ) : (
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
        )}
      </div>
    </>
  );
}
