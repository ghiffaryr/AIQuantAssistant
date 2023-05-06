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
import { PaginationControl } from "react-bootstrap-pagination-control";

export default function OrderPage() {
  const [cartOrderDetailCount, setCartOrderDetailCount] = useState(0);
  const [showGetOrdersToast, setShowGetOrdersToast] = useState(false);
  const [errorGetOrders, setErrorGetOrders] = useState({});
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
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
      let { status, data } = await axios.get(`${API}/order`, {
        params: { page: page, size: size },
      });
      setOrders(data.content);
      setTotalPages(data.totalPages);
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
  }, [page]);

  return (
    <>
      <NavbarComponent cartOrderDetailCount={cartOrderDetailCount} />
      <>
        <Breadcrumbs />
        <OrderList
          orders={orders}
          getOrders={getOrders}
          setOrders={setOrders}
        />
        <PaginationControl
          page={page}
          between={4}
          total={totalPages}
          limit={1}
          changePage={(page) => {
            setPage(page);
          }}
          ellipsis={1}
        />
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
