import React, { useEffect, useState } from "react";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/esm/ToastContainer";
import Breadcrumbs from "../../components/basic/Breadcrumbs";
import NavbarComponent from "../../components/basic/NavbarComponent";
import { API } from "../../env/Constants";
import axios from "axios";
import CartOrderDetailList from "../../components/cart/CartOrderDetailList";
import FooterComponent from "../../components/basic/FooterComponent";
import Button from "react-bootstrap/esm/Button";
import { Link } from "react-router-dom";

export default function CartPage() {
  const [cartOrderDetailCount, setCartOrderDetailCount] = useState(0);
  const [cartOrderDetailTotalPrice, setCartOrderDetailTotalPrice] = useState(0);
  const [showGetCartOrderDetailsToast, setShowGetCartOrderDetailsToast] =
    useState(false);
  const [errorGetCartOrderDetails, setErrorGetCartOrderDetails] = useState({});
  const [showCheckoutToast, setShowCheckoutToast] = useState(false);
  const [errorCheckout, setErrorCheckout] = useState({});
  const [cartOrderDetails, setCartOrderDetails] = useState([]);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart"));
    let counter = Number(0);
    let totaler = Number(0);
    if (cart) {
      for (let i = 0; i < cart.length; i++) {
        counter = Number(counter) + Number(cart[i].quantity);
        totaler =
          Number(totaler) +
          Number(cart[i].productPrice) * Number(cart[i].quantity);
      }
      setCartOrderDetailCount(Number(counter));
      setCartOrderDetailTotalPrice(Number(totaler));
    }
  });

  const getCartOrderDetails = async () => {
    if (localStorage.getItem("userToken")) {
      try {
        axios.defaults.headers.common = {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          "Access-Control-Allow-Origin": "*",
        };
        let { status, data } = await axios.get(`${API}/cart`);
        let cart = data.orderDetails.sort(
          (a, b) => a.orderDetailId - b.orderDetailId
        );
        localStorage.setItem("cart", JSON.stringify(cart));
        setCartOrderDetails(cart);
        setErrorGetCartOrderDetails({});
        setShowGetCartOrderDetailsToast(true);
      } catch (error) {
        for (let errorObject of error.response.data.errors) {
          if (errorObject.code === 20) {
            setCartOrderDetails([]);
          }
          setErrorGetCartOrderDetails(errorObject);
          setShowGetCartOrderDetailsToast(true);
        }
      }
    } else {
      setCartOrderDetails(JSON.parse(localStorage.getItem("cart")));
    }
  };

  useEffect(() => {
    getCartOrderDetails();
  }, []);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     getCartOrderDetails();
  //   }, 5000);

  //   return () => clearTimeout(timer);
  // });

  const handleCheckout = async () => {
    try {
      axios.defaults.headers.common = {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        "Access-Control-Allow-Origin": "*",
      };
      let { status, data } = await axios.post(`${API}/cart/checkout`);
      setErrorCheckout({});
      setShowCheckoutToast(true);
      getCartOrderDetails();
    } catch (error) {
      for (let errorObject of error.response.data.errors) {
        setErrorCheckout(errorObject);
        setShowCheckoutToast(true);
      }
    }
  };

  return (
    <>
      <NavbarComponent cartOrderDetailCount={cartOrderDetailCount} />
      <>
        <Breadcrumbs />
        {cartOrderDetailCount > 0 ? (
          <>
            <div className="container mb-3">
              <div className="row">
                <div className="col col-8">
                  <CartOrderDetailList
                    cartOrderDetails={cartOrderDetails}
                    setCartOrderDetails={setCartOrderDetails}
                  />
                </div>
                <div className="col col-4 flex-column">
                  <h3>Total amount is ${cartOrderDetailTotalPrice}</h3>
                  <Button variant="outline-primary" onClick={handleCheckout}>
                    Checkout
                  </Button>
                </div>
              </div>
            </div>
            <div className="cart-footer">
              <FooterComponent />
            </div>
          </>
        ) : (
          <>
            <div className="main-notfound-navbar-breadcrumbs">
              <div className="notfound-content">
                <h3 className="notfound-header">There is no item in Cart.</h3>
                <h4 className="notfound-link">
                  Explore interesting algorithms in{" "}
                  <Link to="/category">Category Page</Link>
                </h4>
                <h4 className="notfound-link">
                  Go to <Link to="/order">Order Page</Link>
                </h4>
              </div>
            </div>
            <div className="cart-footer">
              <FooterComponent position="absolute" color="white" />
            </div>
          </>
        )}
      </>
      <ToastContainer className="position-fixed p-3 top-0 end-0">
        {Object.keys(errorGetCartOrderDetails).length > 0 && (
          <Toast
            onClose={() => setShowGetCartOrderDetailsToast(false)}
            show={showGetCartOrderDetailsToast}
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
            <Toast.Body>{errorGetCartOrderDetails.message}</Toast.Body>
          </Toast>
        )}
      </ToastContainer>
      <ToastContainer className="position-fixed p-3 top-0 end-0">
        {Object.keys(errorCheckout).length > 0 ? (
          <Toast
            onClose={() => setShowCheckoutToast(false)}
            show={showCheckoutToast}
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
            <Toast.Body>{errorCheckout.message}</Toast.Body>
          </Toast>
        ) : (
          <Toast
            onClose={() => setShowCheckoutToast(false)}
            show={showCheckoutToast}
            delay={3000}
            autohide
          >
            <Toast.Header className="bg-success">
              <img
                src="holder.js/20x20?text=%20"
                className="rounded me-2"
                alt=""
              />
              <strong className="me-auto text-light">Success</strong>
            </Toast.Header>
            <Toast.Body>
              Checkout success! Send payment through our bank account to finish
              your order.
            </Toast.Body>
          </Toast>
        )}
      </ToastContainer>
    </>
  );
}
