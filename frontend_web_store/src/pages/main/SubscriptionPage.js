import axios from "axios";
import React, { useEffect, useState } from "react";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/esm/ToastContainer";
import Breadcrumbs from "../../components/basic/Breadcrumbs";
import FooterComponent from "../../components/basic/FooterComponent";
import NavbarComponent from "../../components/basic/NavbarComponent";
import SubscriptionList from "../../components/subscription/SubscriptionList";
import { API } from "../../env/Constants";
import { PaginationControl } from "react-bootstrap-pagination-control";

export default function SubscriptionPage() {
  const [showGetServerCartToast, setShowGetServerCartToast] = useState(false);
  const [errorGetServerCart, setErrorGetServerCart] = useState({});
  const [cartOrderDetailCount, setCartOrderDetailCount] = useState(0);
  const [showGetSubscriptionsToast, setShowGetSubscriptionsToast] =
    useState(false);
  const [errorGetSubscriptions, setErrorGetSubscriptions] = useState({});
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [subscriptions, setSubscriptions] = useState([]);

  const getServerCart = async () => {
    if (localStorage.getItem("userRole") === "ROLE_CUSTOMER") {
      axios.defaults.headers.common = {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        "Access-Control-Allow-Origin": "*",
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
        localStorage.setItem("cart", JSON.stringify(cart));
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

  const getSubscriptions = async () => {
    try {
      axios.defaults.headers.common = {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        "Access-Control-Allow-Origin": "*",
      };
      let { status, data } = await axios.get(`${API}/subscription`, {
        params: { page: page, size: size },
      });
      setSubscriptions(data.content);
      setTotalPages(data.totalPages);
      setErrorGetSubscriptions({});
      setShowGetSubscriptionsToast(true);
    } catch (error) {
      for (let errorObject of error.response.data.errors) {
        setErrorGetSubscriptions(errorObject);
        setShowGetSubscriptionsToast(true);
      }
    }
  };

  useEffect(() => {
    getServerCart();
    getSubscriptions();
  }, [page]);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     getServerCart();
  //     getSubscriptions();
  //   }, 5000);

  //   return () => clearTimeout(timer);
  // });

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

  return (
    <>
      <NavbarComponent cartOrderDetailCount={cartOrderDetailCount} />
      <>
        <Breadcrumbs />
        <div className="container mb-4 d-flex align-items-center">
          <small>
            <span className="text-danger">*</span> Search for Stock Code at
            Yahoo Finance
          </small>
        </div>
        <SubscriptionList
          subscriptions={subscriptions}
          setSubscriptions={setSubscriptions}
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
        {Object.keys(errorGetSubscriptions).length > 0 && (
          <Toast
            onClose={() => setShowGetSubscriptionsToast(false)}
            show={showGetSubscriptionsToast}
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
            <Toast.Body>{errorGetSubscriptions.message}</Toast.Body>
          </Toast>
        )}
      </ToastContainer>
    </>
  );
}
