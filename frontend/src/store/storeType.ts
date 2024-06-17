type CartDetailsType = {
  orderDetailId: number;
  productCode: string;
  productPrice: number;
  quantity: number;
};

type CartSlice = {
  cart: number;
  cartDetails: CartDetailsType[];
  addCart: () => void;
  setCartOrderDetails: (val: CartDetailsType[]) => void;
  appendCartOrderDetails: (...val: CartDetailsType[]) => void;
};

export type { CartSlice, CartDetailsType };
