import OrderDetail from './OrderDetail';
import { OrderDetailType } from '@/type/OrderDataType';

const OrderDetailList = ({ orderDetails }: OrderDetailListProps) => {
  return (
    <>
      <div className="mt-3">
        <div
          className="row row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4"
          id="order-order-details-row"
        >
          {(orderDetails ?? []).map((orderDetail, idx) => (
            <OrderDetail key={idx} code={orderDetail.productCode!} />
          ))}
        </div>
      </div>
    </>
  );
};

type OrderDetailListProps = {
  orderDetails?: OrderDetailType[];
};

export default OrderDetailList;
