/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/esm/ToastContainer';
import Breadcrumbs from '@/components/commons/Breadcrumbs';
import NavbarComponent from '@/components/commons/NavbarComponent';
import FooterComponent from '@/components/commons/FooterComponent';
import OrderList from '@/components/order/OrderList';
import { PaginationControl } from 'react-bootstrap-pagination-control';
import useServerCart from '@/hooks/useServerCart';
import { useGetOrder, useGetOrderByStatus } from '@/api/order';
import { OrderDataResponseType, OrderDataType } from '@/type/OrderDataType';
import errorHandler from '@/utils/error';
import { EOrderStatus } from '@/enums/OrderStatusEnum';
import { keepPreviousData } from '@tanstack/react-query';

const OrderPage = () => {
  const [showGetOrdersToast, setShowGetOrdersToast] = useState(false);
  const [errorGetOrders, setErrorGetOrders] = useState<{ message?: string }>(
    {},
  );
  const [page, setPage] = useState(1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [size, setSize] = useState(6);
  const [totalPages, setTotalPages] = useState<number | undefined>(1);
  const [orders, setOrders] = useState<OrderDataResponseType[]>([]);
  const [orderStatus, setOrderStatus] = useState<EOrderStatus | null>(null);

  const [oData, setOData] = useState<OrderDataType>();
  const [oError, setOError] = useState<Error | null>();
  const [oIsSuccess, setOIsSuccess] = useState<boolean>();
  const [oIsError, setOIsError] = useState<boolean>();

  const {
    cartOrderDetailCount,
    errorGetServerCart,
    setShowGetServerCartToast,
    showGetServerCartToast,
  } = useServerCart();

  const {
    data: orderWithStatusData,
    error: orderWithStatusError,
    isSuccess: orderWithStatusIsSuccess,
    isError: orderWithStatusIsError,
  } = useGetOrderByStatus(page, size, orderStatus || 0, {
    placeholderData: keepPreviousData,
    enabled:
      orderStatus != null &&
      (orderStatus == EOrderStatus.New ||
        orderStatus == EOrderStatus.Finished ||
        orderStatus == EOrderStatus.Canceled),
  });

  const {
    data: orderData,
    error: orderError,
    isSuccess: orderIsSuccess,
    isError: orderIsError,
  } = useGetOrder(page, size, {
    placeholderData: keepPreviousData,
    enabled:
      orderStatus == null ||
      !(
        orderStatus == EOrderStatus.New ||
        orderStatus == EOrderStatus.Finished ||
        orderStatus == EOrderStatus.Canceled
      ),
  });

  useEffect(() => {
    setOData(orderWithStatusData?.data);
    setOError(orderWithStatusError);
    setOIsError(orderWithStatusIsError);
    setOIsSuccess(orderWithStatusIsSuccess);
  }, [
    orderWithStatusData,
    orderWithStatusError,
    orderWithStatusIsError,
    orderWithStatusIsSuccess,
  ]);

  useEffect(() => {
    setOData(orderData?.data);
    setOError(orderError);
    setOIsError(orderIsError);
    setOIsSuccess(orderIsSuccess);
  }, [orderData, orderError, orderIsError, orderIsSuccess]);

  // getOrders
  useEffect(() => {
    if (oIsSuccess) {
      const orders = [];
      for (const currentOrder of oData?.content ?? []) {
        const orderDetails = (currentOrder.orderDetails ?? []).sort(
          (a, b) => a.orderDetailId! - b.orderDetailId!,
        );
        orders.push({
          orderId: currentOrder.orderId,
          orderDetails: orderDetails,
          userEmail: currentOrder.userEmail,
          orderAmount: currentOrder.orderAmount,
          orderStatus: currentOrder.orderStatus,
          createTime: currentOrder.createTime,
          updateTime: currentOrder.updateTime,
        });
      }
      setOrders(orders);
      setTotalPages(oData?.totalPages);
      setErrorGetOrders({});
      setShowGetOrdersToast(true);
      return;
    }

    if (oIsError) {
      errorHandler({
        error: oError!,
        axiosErrorHandlerFn: err => {
          if (err.code === 40) {
            setOrders([]);
          }
          setErrorGetOrders(err);
          setShowGetOrdersToast(true);
        },
        generalErrorHandlerFn: err => {
          setErrorGetOrders({ message: err.message });
          setShowGetOrdersToast(true);
        },
      });
    }
  }, [oData, oError, oIsSuccess, oIsError]);

  function handleOrderStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setOrderStatus(Number(e.target.value));
  }

  return (
    <>
      <NavbarComponent cartOrderDetailCount={cartOrderDetailCount} />
      <>
        <Breadcrumbs />
        <div className="container mb-3">
          <h5>Filter</h5>
          <Form className="cart-order-detail-form w-100" noValidate>
            <Form.Select
              aria-label="Select Order Status"
              onChange={handleOrderStatusChange}
            >
              <option value={undefined}>Select Order Status</option>
              <option value={undefined}>All</option>
              <option value={0}>New</option>
              <option value={1}>Finished</option>
              <option value={2}>Canceled</option>
            </Form.Select>
          </Form>
        </div>

        <OrderList orders={orders} setOrders={setOrders} />
        <PaginationControl
          page={page}
          between={4}
          total={totalPages || 0}
          limit={1}
          changePage={page => {
            setPage(page);
          }}
          ellipsis={1}
        />
        <FooterComponent />
      </>
      <ToastContainer className="position-fixed p-3 top-0 end-0">
        {Object.keys(errorGetServerCart).length > 0 && (
          <Toast
            onClose={() => setShowGetServerCartToast(false)}
            show={showGetServerCartToast}
            delay={3000}
            autohide
          >
            <Toast.Header className="bg-danger">
              <img
                src="holder.js/20x20?text=%20"
                className="rounded me-2"
                alt=""
              />
              <strong className="me-auto text-light">Error</strong>
            </Toast.Header>
            <Toast.Body>{errorGetServerCart.message}</Toast.Body>
          </Toast>
        )}
      </ToastContainer>
      <ToastContainer className="position-fixed p-3 top-0 end-0">
        {Object.keys(errorGetOrders).length > 0 && (
          <Toast
            onClose={() => setShowGetOrdersToast(false)}
            show={showGetOrdersToast}
            delay={3000}
            autohide
          >
            <Toast.Header className="bg-danger">
              <img
                src="holder.js/20x20?text=%20"
                className="rounded me-2"
                alt=""
              />
              <strong className="me-auto text-light">Error</strong>
            </Toast.Header>
            <Toast.Body>{errorGetOrders.message}</Toast.Body>
          </Toast>
        )}
      </ToastContainer>
    </>
  );
};

export default OrderPage;
