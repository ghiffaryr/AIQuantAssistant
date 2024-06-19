type OrderDataType = {
  content: ContentType[];
  totalPages?: number;
};

type OrderDataResponseType = {
  orderId?: number;
  orderDetails: OrderDetailType[];
  userEmail?: string;
  orderAmount?: number;
  orderStatus?: number;
  createTime?: string;
  updateTime?: string;
};

type ContentType = {
  createTime?: string;
  orderAmount?: number;
  orderId?: number;
  orderStatus?: number;
  updateTime?: string;
  userEmail?: string;
  orderDetails?: OrderDetailType[];
};

type OrderDetailType = {
  orderDetailId?: number;
  productCode?: string;
  productPrice?: number;
  quantity?: number;
};

export type { OrderDataType, OrderDataResponseType, OrderDetailType };
