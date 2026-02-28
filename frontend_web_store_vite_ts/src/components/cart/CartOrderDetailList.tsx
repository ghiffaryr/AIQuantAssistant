import CartOrderDetail from './CartOrderDetail';
import useBoundStore from '@/store/store';

const CartOrderDetailList = () => {
  const cartOrderDetails = useBoundStore.use.cartDetails?.();

  return (
    <>
      <div className="container">
        <div className="row row-cols-1 g-4" id="cart-order-details-row">
          {cartOrderDetails.map((cartOrderDetail, idx) => (
            <CartOrderDetail
              key={idx}
              code={cartOrderDetail.productCode}
              quantity={cartOrderDetail.quantity}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default CartOrderDetailList;
