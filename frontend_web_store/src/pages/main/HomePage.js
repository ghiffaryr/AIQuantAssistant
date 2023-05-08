import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import { LinkContainer } from "react-router-bootstrap";
import FooterComponent from "../../components/basic/FooterComponent";
import NavbarComponent from "../../components/basic/NavbarComponent";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "../../css/pages/main/HomePage.css";
import axios from "axios";
import { API } from "../../env/Constants";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/esm/ToastContainer";

export default function HomePage() {
  const [showGetServerCartToast, setShowGetServerCartToast] = useState(false);
  const [errorGetServerCart, setErrorGetServerCart] = useState({});
  const [cartOrderDetailCount, setCartOrderDetailCount] = useState(0);

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

  useEffect(() => {
    getServerCart();
  }, []);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     getServerCart();
  //   }, 5000);

  //   return () => clearTimeout(timer);
  // });

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart"));
    let counter = 0;
    if (cart) {
      for (let i = 0; i < cart.length; i++) {
        counter = counter + Number(cart[i].quantity);
      }
      setCartOrderDetailCount(counter);
    }
  });

  return (
    <>
      <NavbarComponent cartOrderDetailCount={cartOrderDetailCount} />
      <>
        <main className="main-homepage pt-5">
          <Row className="main-content d-flex justify-content-start align-items-center">
            <Col xs={1}></Col>
            <Col md={4} sm={8} xs={11}>
              <h3 className="text-white">
                Assist your quantitative analysis by our AI quant assistant at
                affordable price
              </h3>
              <LinkContainer to="/category">
                <Button variant="outline-light" className="mt-2">
                  See more
                </Button>
              </LinkContainer>
            </Col>
            <Col xs={7}></Col>
          </Row>
        </main>
        <div className="homepage-footer">
          <FooterComponent position="absolute" color="white" />
        </div>
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
    </>
  );
}
