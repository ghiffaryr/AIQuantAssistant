/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import Toast from 'react-bootstrap/Toast';
import Button from 'react-bootstrap/esm/Button';
import ToastContainer from 'react-bootstrap/esm/ToastContainer';
import OrderStatusEnum, { EOrderStatus } from '../../enums/OrderStatusEnum';
import OrderDetailList from './OrderDetailList';
import { useCancelOrder, useFinishOrder } from '@/api/order';
import errorHandler from '@/utils/error';
import { OrderDataResponseType, OrderDetailType } from '@/type/OrderDataType';
import useBoundStore from '@/store/store';

const Order = ({
  id,
  details,
  amount,
  status,
  createTime,
  orders,
  setOrders,
}: OrderProps) => {
  const [showCancelOrderToast, setShowCancelOrderToast] = useState(false);
  const [errorCancelOrder, setErrorCancelOrder] = useState({});
  const [showFinishOrderToast, setShowFinishOrderToast] = useState(false);
  const [errorFinishOrder, setErrorFinishOrder] = useState({});

  const userRole = useBoundStore.use.userRole?.();

  const cancelOrderMutate = useCancelOrder({
    onError: err => {
      errorHandler({
        error: err,
        axiosErrorHandlerFn: err => {
          setErrorCancelOrder(err);
          setShowCancelOrderToast(true);
        },
        generalErrorHandlerFn: err => {
          setErrorCancelOrder({ message: err.message });
          setShowCancelOrderToast(true);
        },
      });
    },
    successSideEffect: () => {
      handleStatusLocalChange(EOrderStatus.Finished);
      setErrorCancelOrder({});
      setShowCancelOrderToast(true);
    },
  });

  const finishOrderMutate = useFinishOrder({
    onError: err => {
      errorHandler({
        error: err,
        axiosErrorHandlerFn: () => {
          setErrorFinishOrder(err);
          setShowFinishOrderToast(true);
        },
        generalErrorHandlerFn: err => {
          setErrorFinishOrder({ message: err.message });
          setShowFinishOrderToast(true);
        },
      });
    },
    successSideEffect: () => {
      handleStatusLocalChange(EOrderStatus.Canceled);
      setErrorFinishOrder({});
      setShowFinishOrderToast(true);
    },
  });

  function handleStatusLocalChange(status: any) {
    let newOrders = orders;
    newOrders = newOrders.map(order => {
      if (order.orderId === id) {
        order.orderStatus = status;
      }
      return order;
    });
    setOrders(newOrders);
  }

  const handleCancelOrder = (id: any) => {
    cancelOrderMutate.mutate({ id });
  };

  const handleFinishOrder = (id: any) => {
    finishOrderMutate.mutate({ id });
  };

  return (
    <>
      <div className="col">
        <div className="card h-100">
          <div className="card-body d-flex flex-column justify-content-between">
            <div className="row row-cols-2">
              <div className="col">
                <h5 className="card-title">ID {id}</h5>
                <h6 className="card-subtitle mb-2 text-muted">
                  {OrderStatusEnum[status?.valueOf() || 0]}
                </h6>
                <p className="card-text">Total amount is ${amount}</p>
              </div>
              <div className="col">
                <div className="d-flex justify-content-end">
                  {status === EOrderStatus.New && (
                    <div className="ms-4">
                      <Button
                        variant="outline-danger"
                        onClick={() => handleCancelOrder(id)}>
                        Cancel Order
                      </Button>
                    </div>
                  )}
                  {status === EOrderStatus.New &&
                    (userRole === 'ROLE_EMPLOYEE' ||
                      userRole === 'ROLE_MANAGER') && (
                      <div className="ms-4">
                        <Button
                          variant="outline-success"
                          onClick={() => handleFinishOrder(id)}>
                          Finish Order
                        </Button>
                      </div>
                    )}
                </div>
              </div>
            </div>
            <OrderDetailList orderDetails={details} />
          </div>
          <div className="card-footer">
            <small className="text-muted">
              Created at{' '}
              {createTime
                ? new Date(createTime).toString()
                : new Date(0).toString()}
            </small>
          </div>
        </div>
      </div>
      <>
        <ToastContainer className="position-fixed p-3 top-0 end-0">
          {Object.keys(errorCancelOrder).length > 0 ? (
            <Toast
              onClose={() => setShowCancelOrderToast(false)}
              show={showCancelOrderToast}
              delay={3000}
              autohide>
              <Toast.Header className="bg-danger">
                <img
                  src="holder.js/20x20?text=%20"
                  className="rounded me-2"
                  alt=""
                />
                <strong className="me-auto text-light">Error</strong>
              </Toast.Header>
              <Toast.Body>{(errorCancelOrder as any).message}</Toast.Body>
            </Toast>
          ) : (
            <Toast
              onClose={() => setShowCancelOrderToast(false)}
              show={showCancelOrderToast}
              delay={3000}
              autohide>
              <Toast.Header className="bg-success">
                <img
                  src="holder.js/20x20?text=%20"
                  className="rounded me-2"
                  alt=""
                />
                <strong className="me-auto text-light">Success</strong>
              </Toast.Header>
              <Toast.Body>Cancel order success!</Toast.Body>
            </Toast>
          )}
        </ToastContainer>
        <ToastContainer className="position-fixed p-3 top-0 end-0">
          {Object.keys(errorFinishOrder).length > 0 ? (
            <Toast
              onClose={() => setShowFinishOrderToast(false)}
              show={showFinishOrderToast}
              delay={3000}
              autohide>
              <Toast.Header className="bg-danger">
                <img
                  src="holder.js/20x20?text=%20"
                  className="rounded me-2"
                  alt=""
                />
                <strong className="me-auto text-light">Error</strong>
              </Toast.Header>
              <Toast.Body>{(errorFinishOrder as any).message}</Toast.Body>
            </Toast>
          ) : (
            <Toast
              onClose={() => setShowFinishOrderToast(false)}
              show={showFinishOrderToast}
              delay={3000}
              autohide>
              <Toast.Header className="bg-success">
                <img
                  src="holder.js/20x20?text=%20"
                  className="rounded me-2"
                  alt=""
                />
                <strong className="me-auto text-light">Success</strong>
              </Toast.Header>
              <Toast.Body>Finish order success!</Toast.Body>
            </Toast>
          )}
        </ToastContainer>
      </>
    </>
  );
};

type OrderProps = {
  id?: number;
  details: OrderDetailType[];
  amount?: number;
  status?: EOrderStatus;
  createTime?: string;
  orders: OrderDataResponseType[];
  setOrders: React.Dispatch<React.SetStateAction<OrderDataResponseType[]>>;
};

export default Order;
