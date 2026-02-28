type OrderDetail = {
  orderDetailId?: number;
  productCode?: string;
  productPrice?: number;
  quantity?: number;
};

type CartDetailResponseType = {
  cartId?: number;
  orderDetails?: OrderDetail[];
};

export type { OrderDetail, CartDetailResponseType };
