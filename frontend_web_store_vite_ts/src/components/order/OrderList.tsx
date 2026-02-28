import { OrderDataResponseType } from '@/type/OrderDataType';
import Order from './Order';

const OrderList = ({ orders, setOrders }: OrderListProps) => {
  return (
    <>
      <div className="container mb-3">
        <div
          className="row row-cols-1 g-4
        "
          id="categories-row"
        >
          {orders.map((order, idx) => (
            <Order
              key={idx}
              id={order.orderId}
              details={order.orderDetails}
              amount={order.orderAmount}
              status={order.orderStatus}
              createTime={order.createTime}
              orders={orders}
              setOrders={setOrders}
            />
          ))}
        </div>
      </div>
    </>
  );
};

type OrderListProps = {
  setOrders: React.Dispatch<React.SetStateAction<OrderDataResponseType[]>>;
  orders: OrderDataResponseType[];
};

export default OrderList;
