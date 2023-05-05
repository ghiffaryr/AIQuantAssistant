import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import { LinkContainer } from "react-router-bootstrap";
import FooterComponent from "../components/FooterComponent";
import NavbarComponent from "../components/NavbarComponent";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "../css/HomePage.css";

export default function HomePage() {
  const [cartOrderDetailCount, setCartOrderDetailCount] = useState(0);

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
    </>
  );
}
