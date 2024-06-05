import React from 'react';
import CartOrderDetail from './CartOrderDetail';

export default function CartOrderDetailList({
  cartOrderDetails,
  setCartOrderDetails,
}) {
  return (
    <>
      <div className="container">
        <div className="row row-cols-1 g-4" id="cart-order-details-row">
          {cartOrderDetails.map((cartOrderDetail, idx) => (
            <CartOrderDetail
              key={idx}
              id={cartOrderDetail.orderDetailId}
              code={cartOrderDetail.productCode}
              price={cartOrderDetail.productPrice}
              quantity={cartOrderDetail.quantity}
              setCartOrderDetails={setCartOrderDetails}
            />
          ))}
        </div>
      </div>
    </>
  );
}
