import React, { useEffect, useState } from "react";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/esm/ToastContainer";
import Breadcrumbs from "../components/Breadcrumbs";
import NavbarComponent from "../components/NavbarComponent";
import { API } from "../env/Constants";
import axios from "axios";
import FooterComponent from "../components/FooterComponent";
import Button from "react-bootstrap/esm/Button";
import { Link } from "react-router-dom";
import OrderList from "../components/order/OrderList";

export default function OrderPage() {
  const [cartOrderDetailCount, setCartOrderDetailCount] = useState(0);
  const [showGetOrdersToast, setShowGetOrdersToast] = useState(false);
  const [errorGetOrders, setErrorGetOrders] = useState({});
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(3);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart"));
    let counter = Number(0);
    if (cart) {
      for (let i = 0; i < cart.length; i++) {
        counter = Number(counter) + Number(cart[i].quantity);
      }
      setCartOrderDetailCount(Number(counter));
    }
  });

  const getOrders = async () => {
    try {
      axios.defaults.headers.common = {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        "Access-Control-Allow-Origin": "*",
      };
      let { status, data } = await axios.get(`${API}/order`);
      setOrders(data.content);
      setErrorGetOrders({});
      setShowGetOrdersToast(true);
    } catch (error) {
      for (let errorObject of error.response.data.errors) {
        setErrorGetOrders(errorObject);
        setShowGetOrdersToast(true);
      }
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <>
      <NavbarComponent cartOrderDetailCount={cartOrderDetailCount} />
      <>
        <Breadcrumbs />
        <div className="container mt-3 mb-3">
          <div className="row">
            <OrderList
              orders={orders}
              getOrders={getOrders}
              setOrders={setOrders}
            />
          </div>
        </div>
        <div className="cart-footer">
          <FooterComponent />
        </div>
        <ToastContainer className="p-3 top-0 end-0">
          <Toast
            onClose={() => setShowGetOrdersToast(false)}
            show={showGetOrdersToast}
            delay={3000}
            autohide
          >
            {Object.keys(errorGetOrders).length > 0 && (
              <>
                <Toast.Header className="bg-danger">
                  <img
                    src="holder.js/20x20?text=%20"
                    className="rounded me-2"
                    alt=""
                  />
                  <strong className="me-auto text-light">Error</strong>
                </Toast.Header>
                <Toast.Body>{errorGetOrders.message}</Toast.Body>
              </>
            )}
          </Toast>
        </ToastContainer>
      </>
    </>
  );
}
