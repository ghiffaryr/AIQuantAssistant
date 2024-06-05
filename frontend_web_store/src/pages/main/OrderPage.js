import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/esm/ToastContainer';
import Breadcrumbs from '../../components/basic/Breadcrumbs';
import NavbarComponent from '../../components/basic/NavbarComponent';
import { API } from '../../env/Constants';
import axios from 'axios';
import FooterComponent from '../../components/basic/FooterComponent';
import OrderList from '../../components/order/OrderList';
import { PaginationControl } from 'react-bootstrap-pagination-control';
import OrderStatusEnum from '../../enums/OrderStatusEnum';

export default function OrderPage() {
  const [showGetServerCartToast, setShowGetServerCartToast] = useState(false);
  const [errorGetServerCart, setErrorGetServerCart] = useState({});
  const [cartOrderDetailCount, setCartOrderDetailCount] = useState(0);
  const [showGetOrdersToast, setShowGetOrdersToast] = useState(false);
  const [errorGetOrders, setErrorGetOrders] = useState({});
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [orders, setOrders] = useState([]);
  const [orderStatus, setOrderStatus] = useState(null);

  const getServerCart = async () => {
    if (localStorage.getItem('userRole') === 'ROLE_CUSTOMER') {
      axios.defaults.headers.common = {
        Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        'Access-Control-Allow-Origin': '*',
      };
      try {
        let { status, data } = await axios.get(`${API}/cart`);
        let cart = [];
        for (let orderDetail of data.orderDetails) {
          cart.push({
            orderDetailId: orderDetail.orderDetailId,
            productCode: orderDetail.productCode,
            productPrice: orderDetail.productPrice,
            quantity: orderDetail.quantity,
          });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        setErrorGetServerCart({});
        setShowGetServerCartToast(false);
      } catch (error) {
        for (let errorObject of error.response.data.errors) {
          setErrorGetServerCart(errorObject);
          setShowGetServerCartToast(true);
        }
      }
    }
  };

  const getOrders = async () => {
    try {
      axios.defaults.headers.common = {
        Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        'Access-Control-Allow-Origin': '*',
      };
      if (orderStatus == 0 || orderStatus == 1 || orderStatus == 2) {
        let { status, data } = await axios.get(
          `${API}/order/${OrderStatusEnum[orderStatus].toLowerCase()}`,
          {
            params: { page: page, size: size },
          },
        );
        let orders = [];
        for (let currentOrder of data.content) {
          let orderDetails = currentOrder.orderDetails.sort(
            (a, b) => a.orderDetailId - b.orderDetailId,
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
        setTotalPages(data.totalPages);
      } else {
        let { status, data } = await axios.get(`${API}/order`, {
          params: { page: page, size: size },
        });
        let orders = [];
        for (let currentOrder of data.content) {
          let orderDetails = currentOrder.orderDetails.sort(
            (a, b) => a.orderDetailId - b.orderDetailId,
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
        setTotalPages(data.totalPages);
      }
      setErrorGetOrders({});
      setShowGetOrdersToast(true);
    } catch (error) {
      for (let errorObject of error.response.data.errors) {
        if (errorObject.code === 40) {
          setOrders([]);
        }
        setErrorGetOrders(errorObject);
        setShowGetOrdersToast(true);
      }
    }
  };

  useEffect(() => {
    getServerCart();
    getOrders();
  }, [page, orderStatus]);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     getServerCart()
  //     getOrders();
  //   }, 5000);

  //   return () => clearTimeout(timer);
  // });

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart'));
    let counter = Number(0);
    if (cart) {
      for (let i = 0; i < cart.length; i++) {
        counter = Number(counter) + Number(cart[i].quantity);
      }
      setCartOrderDetailCount(Number(counter));
    }
  });

  function handleOrderStatusChange(e) {
    setOrderStatus(e.target.value);
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
              <option value={null}>Select Order Status</option>
              <option value={null}>All</option>
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
          total={totalPages}
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
}
