import React from "react";
import { useEffect } from "react";
import CartOrderDetail from "./CartOrderDetail";

export default function CartOrderDetailList({
  cartOrderDetailCount,
  setCartOrderDetailCount,
  cartOrderDetails,
  getCartOrderDetails,
  setCartOrderDetails,
}) {
  return (
    <>
      <div className="container">
        <div className="row row-cols-1 g-4" id="cart-order-details-row">
          {cartOrderDetails.map((cartOrderDetail, idx) => (
            <CartOrderDetail
              cartOrderDetailCount={cartOrderDetailCount}
              setCartOrderDetailCount={setCartOrderDetailCount}
              key={idx}
              id={cartOrderDetail.orderDetailId}
              code={cartOrderDetail.productCode}
              price={cartOrderDetail.productPrice}
              quantity={cartOrderDetail.quantity}
              getCartOrderDetails={getCartOrderDetails}
              setCartOrderDetails={setCartOrderDetails}
            />
          ))}
        </div>
      </div>
    </>
  );
}
