import axios from "axios";
import React, { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/Form";
import ToastContainer from "react-bootstrap/esm/ToastContainer";
import Toast from "react-bootstrap/Toast";
import ProductStatusEnum from "../../enums/ProductStatusEnum";
import { API } from "../../env/Constants";
import FloatingLabel from "react-bootstrap/esm/FloatingLabel";

export default function Product({
  id,
  code,
  name,
  price,
  period,
  description,
  image,
  status,
  createTime,
  updateTime,
  setCartOrderDetailCount,
}) {
  const [inputs, setInputs] = useState({ quantity: 1 });
  const [validated, setValidated] = useState(false);
  const [showAddToCartToast, setShowAddToCartToast] = useState(false);
  const [errorAddToCart, setErrorAddToCart] = useState({});

  function handleChange(e) {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  }

  const handleAddToCart = async (quantity) => {
    let cart = JSON.parse(localStorage.getItem("cart"));
    let newCart = cart;
    let isOrderDetailFound = false;
    if (cart) {
      let newQuantity = 0;
      for (let i = 0; i < newCart.length; i++) {
        if (newCart[i].productCode === code) {
          newCart[i].productPrice = price;
          newQuantity = Number(newCart[i].quantity) + Number(quantity);
          newCart[i].quantity = newQuantity;
          isOrderDetailFound = true;
          break;
        }
      }
      if (isOrderDetailFound) {
        if (localStorage.getItem("userToken")) {
          axios.defaults.headers.common = {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            "Access-Control-Allow-Origin": "*",
          };
          try {
            let { status, data } = await axios.put(
              `${API}/cart/${code}/update`,
              newQuantity,
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            setErrorAddToCart({});
            setShowAddToCartToast(true);
          } catch (error) {
            for (let errorObject of error.response.data.errors) {
              setErrorAddToCart(errorObject);
              setShowAddToCartToast(true);
            }
          }
        }
      }
      if (!isOrderDetailFound) {
        newCart.push({
          productCode: code,
          productPrice: price,
          quantity: Number(quantity),
        });
      }
    } else {
      newCart = [
        {
          productCode: code,
          productPrice: price,
          quantity: Number(quantity),
        },
      ];
    }
    localStorage.setItem("cart", JSON.stringify(newCart));
    if (!cart || !isOrderDetailFound) {
      if (localStorage.getItem("userToken")) {
        axios.defaults.headers.common = {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          "Access-Control-Allow-Origin": "*",
        };
        try {
          let { status, data } = await axios.post(`${API}/cart/add`, {
            productCode: code,
            quantity: Number(quantity),
          });
          setErrorAddToCart({});
          setShowAddToCartToast(true);
        } catch (error) {
          for (let errorObject of error.response.data.errors) {
            setErrorAddToCart(errorObject);
            setShowAddToCartToast(true);
          }
        }
      }
    }
    let counter = Number(0);
    for (let i = 0; i < cart.length; i++) {
      counter = Number(counter) + Number(cart[i].quantity);
    }
    setCartOrderDetailCount(Number(counter));
  };

  const handleSubmitAddToCart = async (e) => {
    const form = e.currentTarget;

    setValidated(true);
    e.preventDefault();
    if (form.checkValidity()) {
      await handleAddToCart(e.target[0].value);
    }
  };

  return (
    <>
      <div className="col">
        <div className="card h-100">
          <img
            src={
              image
                ? image
                : "https://firebasestorage.googleapis.com/v0/b/ai-quant-assistant.appspot.com/o/product_image_notfound.jpg?alt=media&token=9b66da8d-37b7-4f30-bbc2-1338d7e2f52c"
            }
            className="card-img-top"
            alt="Product Image"
            height={250}
            overflow="hidden"
          />
          <div className="card-body d-flex flex-column justify-content-between">
            <div className="card-description">
              <h5 className="card-title">{name}</h5>
              <h6 className="card-subtitle mb-2 text-muted">{code}</h6>
              <p className="card-text">{description}</p>
              <p className="card-text">{ProductStatusEnum[status]}</p>
              <p className="card-text">${price}</p>
              <p className="card-text">
                {period} {period < 2 ? "month" : "months"}
              </p>
            </div>
            {localStorage.getItem("userRole") != "ROLE_EMPLOYEE" &&
              localStorage.getItem("userRole") != "ROLE_MANAGER" && (
                <div className="card-form w-100 align-self-center mt-3">
                  <Form
                    className="cart-form"
                    noValidate
                    validated={validated}
                    onSubmit={handleSubmitAddToCart}
                  >
                    <FloatingLabel
                      controlId="floatingInput"
                      label="Quantity"
                      className="mb-3"
                    >
                      <Form.Control
                        type="number"
                        name="quantity"
                        value={inputs.quantity}
                        onChange={handleChange}
                        onWheel={(e) => e.target.blur()}
                        placeholder="Quantity"
                        min={1}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Minimum quantity is 1.
                      </Form.Control.Feedback>
                    </FloatingLabel>
                    <div className="text-center">
                      <Button type="submit" variant="outline-primary">
                        Add to Cart
                      </Button>
                    </div>
                  </Form>
                </div>
              )}
          </div>
          <div className="card-footer">
            <small className="text-muted">
              Updated at {new Date(updateTime).toString()}
            </small>
          </div>
        </div>
      </div>
      <>
        <ToastContainer className="position-fixed p-3 top-0 end-0">
          {Object.keys(errorAddToCart).length > 0 ? (
            <Toast
              onClose={() => setShowAddToCartToast(false)}
              show={showAddToCartToast}
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
              <Toast.Body>{errorAddToCart.message}</Toast.Body>
            </Toast>
          ) : (
            <Toast
              onClose={() => setShowAddToCartToast(false)}
              show={showAddToCartToast}
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
              <Toast.Body>Add to Cart success!</Toast.Body>
            </Toast>
          )}
        </ToastContainer>
      </>
    </>
  );
}
