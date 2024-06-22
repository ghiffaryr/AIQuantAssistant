type ProductDataResponseType = {
  content?: ProductDataType[];
  totalPages?: number;
};

type ProductCategoryResponseType = {
  page?: ProductDataResponseType
}

type ProductDataType = {
  productId?: number | null;
  productCode?: string;
  productName?: string;
  productPrice?: number | null;
  productPeriod?: number | null;
  productDescription?: string;
  productImage?: string;
  productStatus?: number | null;
  productCategoryCode?: string;
  createTime?: string;
  updateTime?: string;
};

export type { ProductDataType, ProductDataResponseType, ProductCategoryResponseType };
