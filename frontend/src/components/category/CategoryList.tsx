import React from 'react';
import Category from './Category';
import { CategoryDetailType } from '@/type/CategoryType';
import useBoundStore from '@/store/store';
const CategoryList = ({ categories, setCategories }: CategoryListProps) => {
  const userRole = useBoundStore.use.userRole?.();
  return (
    <>
      <div className="container mb-3">
        {userRole === 'ROLE_EMPLOYEE' || userRole === 'ROLE_MANAGER' ? (
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
};

type CategoryListProps = {
  categories: CategoryDetailType[];
  setCategories: React.Dispatch<React.SetStateAction<CategoryDetailType[]>>;
};

export default CategoryList;
