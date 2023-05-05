import React, { useEffect, useState } from "react";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/esm/ToastContainer";
import Breadcrumbs from "../components/Breadcrumbs";
import NavbarComponent from "../components/NavbarComponent";
import { API } from "../env/Constants";
import ProductList from "../components/product/ProductList";
import axios from "axios";
import CartOrderDetailList from "../components/cart/CartOrderDetailList";
import FooterComponent from "../components/FooterComponent";
import Button from "react-bootstrap/esm/Button";

export default function CartPage() {
  const [cartOrderDetailCount, setCartOrderDetailCount] = useState(0);
  const [showGetCartOrderDetailsToast, setShowGetCartOrderDetailsToast] =
    useState(false);
  const [errorGetCartOrderDetails, setErrorGetCartOrderDetails] = useState({});
  const [showCheckoutToast, setShowCheckoutToast] = useState(false);
  const [errorCheckout, setErrorCheckout] = useState({});
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(3);
  const [cartOrderDetails, setCartOrderDetails] = useState([]);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart"));
    let counter = 0;
    if (cart) {
      for (let i = 0; i < cart.length; i++) {
        counter = counter + cart[i].quantity;
      }
      setCartOrderDetailCount(counter);
    }
  }, []);

  const getCartOrderDetails = async () => {
    try {
      axios.defaults.headers.common = {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        "Access-Control-Allow-Origin": "*",
      };
      let { status, data } = await axios.get(`${API}/cart`);
      localStorage.setItem("cart", JSON.stringify(data.orderDetails));
      setCartOrderDetails(data.orderDetails);
      setErrorGetCartOrderDetails({});
      setShowGetCartOrderDetailsToast(true);
    } catch (error) {
      for (let errorObject of error.response.data.errors) {
        setErrorGetCartOrderDetails(errorObject);
        setShowGetCartOrderDetailsToast(true);
      }
    }
  };

  const handleCheckout = async () => {
    try {
      axios.defaults.headers.common = {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        "Access-Control-Allow-Origin": "*",
      };
      let { status, data } = await axios.post(`${API}/cart/checkout`);
      setErrorCheckout({});
      showCheckoutToast(true);
      getCartOrderDetails();
    } catch (error) {
      for (let errorObject of error.response.data.errors) {
        setErrorCheckout(errorObject);
        showCheckoutToast(true);
      }
    }
  };

  useEffect(() => {
    getCartOrderDetails();
  }, []);

  return (
    <>
      <NavbarComponent cartOrderDetailCount={cartOrderDetailCount} />
      <>
        <Breadcrumbs />

        <div className="container mt-3 mb-3">
          <div className="row">
            <div className="col col-8">
              <CartOrderDetailList
                cartOrderDetailCount={cartOrderDetailCount}
                setCartOrderDetailCount={setCartOrderDetailCount}
                cartOrderDetails={cartOrderDetails}
                getCartOrderDetails={getCartOrderDetails}
                setCartOrderDetails={setCartOrderDetails}
              />
            </div>
            <div className="col col-2 ">
              <Button variant="outline-primary" onClick={() => handleCheckout}>
                Checkout
              </Button>
            </div>
          </div>
        </div>
        <div className="cart-footer">
          <FooterComponent />
        </div>
        <ToastContainer className="p-3 top-0 end-0">
          <Toast
            onClose={() => setShowGetCartOrderDetailsToast(false)}
            show={showGetCartOrderDetailsToast}
            delay={3000}
            autohide
          >
            {Object.keys(errorGetCartOrderDetails).length > 0 && (
              <>
                <Toast.Header className="bg-danger">
                  <img
                    src="holder.js/20x20?text=%20"
                    className="rounded me-2"
                    alt=""
                  />
                  <strong className="me-auto text-light">Error</strong>
                </Toast.Header>
                <Toast.Body>{errorGetCartOrderDetails.message}</Toast.Body>
              </>
            )}
          </Toast>
        </ToastContainer>
        <ToastContainer className="p-3 top-0 end-0">
          <Toast
            onClose={() => setShowGetCartOrderDetailsToast(false)}
            show={showCheckoutToast}
            delay={3000}
            autohide
          >
            {Object.keys(errorCheckout).length > 0 ? (
              <>
                <Toast.Header className="bg-danger">
                  <img
                    src="holder.js/20x20?text=%20"
                    className="rounded me-2"
                    alt=""
                  />
                  <strong className="me-auto text-light">Error</strong>
                </Toast.Header>
                <Toast.Body>{errorCheckout.message}</Toast.Body>
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
                <Toast.Body>Checkout success!</Toast.Body>
              </>
            )}
          </Toast>
        </ToastContainer>
      </>
    </>
  );
}
