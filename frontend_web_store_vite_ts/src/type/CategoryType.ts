type CategoryDataResponseType = {
  content: CategoryDetailType[];
  totalPages?: number;
};

type CategoryDetailType = {
  createTime?: string;
  productCategoryCode?: string;
  productCategoryDescription?: string;
  productCategoryId?: number;
  productCategoryImage?: string;
  productCategoryName?: string;
  updateTime?: string;
};

type CategoryPayloadType = {
  productCategoryCode: string;
  productCategoryDescription: string;
  productCategoryImage: string;
  productCategoryName: string;
};

export type {
  CategoryDataResponseType,
  CategoryDetailType,
  CategoryPayloadType,
};
