import React, { useEffect, useState } from "react";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/esm/ToastContainer";
import Breadcrumbs from "../components/Breadcrumbs";
import NavbarComponent from "../components/NavbarComponent";
import { API } from "../env/Constants";
import axios from "axios";
import OrderOrderDetailList from "../components/cart/OrderOrderDetailList";
import FooterComponent from "../components/FooterComponent";
import Button from "react-bootstrap/esm/Button";
import { Link } from "react-router-dom";

export default function OrderPage() {
  const [cartOrderDetailCount, setOrderOrderDetailCount] = useState(0);
  const [showGetOrderOrderDetailsToast, setShowGetOrderOrderDetailsToast] =
    useState(false);
  const [errorGetOrderOrderDetails, setErrorGetOrderOrderDetails] = useState(
    {}
  );
  const [showCancelOrderToast, setShowCancelOrderToast] = useState(false);
  const [errorCancelOrder, setErrorCancelOrder] = useState({});
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(3);
  const [cartOrderDetails, setOrderOrderDetails] = useState([]);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart"));
    let counter = Number(0);
    if (cart) {
      for (let i = 0; i < cart.length; i++) {
        counter = Number(counter) + Number(cart[i].quantity);
      }
      setOrderOrderDetailCount(Number(counter));
    }
  });

  const getOrderOrderDetails = async () => {
    try {
      axios.defaults.headers.common = {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        "Access-Control-Allow-Origin": "*",
      };
      let { status, data } = await axios.get(`${API}/cart`);
      localStorage.setItem("cart", JSON.stringify(data.orderDetails));
      setOrderOrderDetails(data.orderDetails);
      setErrorGetOrderOrderDetails({});
      setShowGetOrderOrderDetailsToast(true);
    } catch (error) {
      for (let errorObject of error.response.data.errors) {
        setErrorGetOrderOrderDetails(errorObject);
        setShowGetOrderOrderDetailsToast(true);
      }
    }
  };

  const handleCancelOrder = async () => {
    try {
      axios.defaults.headers.common = {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        "Access-Control-Allow-Origin": "*",
      };
      let { status, data } = await axios.post(`${API}/cart/checkout`);
      setErrorCancelOrder({});
      showCancelOrderToast(true);
      getOrderOrderDetails();
    } catch (error) {
      for (let errorObject of error.response.data.errors) {
        setErrorCancelOrder(errorObject);
        showCancelOrderToast(true);
      }
    }
  };

  useEffect(() => {
    getOrderOrderDetails();
  }, []);

  return (
    <>
      <NavbarComponent cartOrderDetailCount={cartOrderDetailCount} />
      <>
        <Breadcrumbs />

        {cartOrderDetailCount > 0 ? (
          <div className="container mt-3 mb-3">
            <div className="row">
              <div className="col col-8">
                <OrderOrderDetailList
                  cartOrderDetails={cartOrderDetails}
                  getOrderOrderDetails={getOrderOrderDetails}
                  setOrderOrderDetails={setOrderOrderDetails}
                />
              </div>
              <div className="col col-2 ">
                <Button
                  variant="outline-primary"
                  onClick={() => handleCancelOrder}
                >
                  CancelOrder
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="main-notfound">
            <div className="notfound-content">
              <h3 className="notfound-header">There is no item in Order.</h3>
              <h4 className="notfound-link">
                Explore interesting algorithm in the{" "}
                <Link to="/category">Category Page</Link>
              </h4>
            </div>
          </div>
        )}
        <div className="cart-footer">
          <FooterComponent />
        </div>
        <ToastContainer className="p-3 top-0 end-0">
          <Toast
            onClose={() => setShowGetOrderOrderDetailsToast(false)}
            show={showGetOrderOrderDetailsToast}
            delay={3000}
            autohide
          >
            {Object.keys(errorGetOrderOrderDetails).length > 0 && (
              <>
                <Toast.Header className="bg-danger">
                  <img
                    src="holder.js/20x20?text=%20"
                    className="rounded me-2"
                    alt=""
                  />
                  <strong className="me-auto text-light">Error</strong>
                </Toast.Header>
                <Toast.Body>{errorGetOrderOrderDetails.message}</Toast.Body>
              </>
            )}
          </Toast>
        </ToastContainer>
        <ToastContainer className="p-3 top-0 end-0">
          <Toast
            onClose={() => setShowGetOrderOrderDetailsToast(false)}
            show={showCancelOrderToast}
            delay={3000}
            autohide
          >
            {Object.keys(errorCancelOrder).length > 0 ? (
              <>
                <Toast.Header className="bg-danger">
                  <img
                    src="holder.js/20x20?text=%20"
                    className="rounded me-2"
                    alt=""
                  />
                  <strong className="me-auto text-light">Error</strong>
                </Toast.Header>
                <Toast.Body>{errorCancelOrder.message}</Toast.Body>
              </>
            ) : (
              <>
                <Toast.Header className="bg-success">
                  <img
                    src="holder.js/20x20?text=%20"
                    className="rounded me-2"
                    alt=""
                  />
                  <strong className="me-auto text-light">Success</strong>
                </Toast.Header>
                <Toast.Body>Cancel order success!</Toast.Body>
              </>
            )}
          </Toast>
        </ToastContainer>
      </>
    </>
  );
}
