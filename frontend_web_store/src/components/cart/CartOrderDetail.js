import axios from "axios";
import React, { useEffect, useState } from "react";
import FloatingLabel from "react-bootstrap/esm/FloatingLabel";
import ToastContainer from "react-bootstrap/esm/ToastContainer";
import Toast from "react-bootstrap/Toast";
import Form from "react-bootstrap/Form";
import { FaPlus, FaMinus } from "react-icons/fa";
import ProductStatusEnum from "../../enums/ProductStatusEnum";
import { API } from "../../env/Constants";
import Button from "react-bootstrap/esm/Button";

export default function CartOrderDetail({
  id,
  code,
  price,
  quantity,
  setCartOrderDetails,
}) {
  const [validated, setValidated] = useState(false);
  const [product, setProduct] = useState({
    productId: null,
    productCode: "",
    productName: "",
    productPrice: null,
    productPeriod: null,
    productDescription: "",
    productImage: "",
    productStatus: null,
    productCategoryCode: "",
    createTime: "",
    updateTime: "",
  });
  const [showGetProductToast, setShowGetProductToast] = useState(false);
  const [errorGetProduct, setErrorGetProduct] = useState({});
  const [showUpdateCartOrderDetailToast, setShowUpdateCartOrderDetailToast] =
    useState(false);
  const [errorUpdateCartOrderDetail, setErrorUpdateCartOrderDetail] = useState(
    {}
  );

  function handleQuantityLocalChange(quantity) {
    let oldCart = JSON.parse(localStorage.getItem("cart"));
    let newCart = [];
    for (let orderDetail of oldCart) {
      if (orderDetail.productCode !== code) {
        newCart.push({
          orderDetailsId: orderDetail.orderDetailId,
          productCode: orderDetail.productCode,
          productPrice: orderDetail.productPrice,
          quantity: orderDetail.quantity,
        });
      }
      if (orderDetail.productCode === code && Number(quantity) > 0) {
        newCart.push({
          orderDetailsId: orderDetail.orderDetailId,
          productCode: orderDetail.productCode,
          productPrice: orderDetail.productPrice,
          quantity: Number(quantity),
        });
      }
    }
    localStorage.setItem("cart", JSON.stringify(newCart));
    setCartOrderDetails(newCart);
  }

  const handleQuantityServerChange = async (quantity) => {
    if (localStorage.getItem("userToken")) {
      try {
        axios.defaults.headers.common = {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          "Access-Control-Allow-Origin": "*",
        };
        if (Number(quantity) > 0) {
          let { status, data } = await axios.put(
            `${API}/cart/${code}/update`,
            Number(quantity),
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        }
        if (Number(quantity) === 0) {
          let { status, data } = await axios.delete(
            `${API}/cart/${code}/delete`
          );
        }
        setErrorUpdateCartOrderDetail({});
        setShowUpdateCartOrderDetailToast(true);
      } catch (error) {
        for (let errorObject of error.response.data.errors) {
          setErrorUpdateCartOrderDetail(errorObject);
          setShowUpdateCartOrderDetailToast(true);
        }
      }
    }
  };

  const handleQuantityChange = async (quantity) => {
    await handleQuantityServerChange(quantity);
    handleQuantityLocalChange(quantity);
  };

  const handleSubmitCartOrderDetail = async (e) => {
    const form = e.currentTarget;

    setValidated(true);
    e.preventDefault();
    if (form.checkValidity()) {
      await handleQuantityChange(e.target[0].value);
    }
  };

  const handleQuantityMinus = async () => {
    if (Number(quantity) > 0) {
      let newQuantity = Number(quantity) - Number(1);
      await handleQuantityChange(newQuantity);
    } else {
      await handleQuantityChange(quantity);
    }
  };

  const handleQuantityPlus = async () => {
    let newQuantity = Number(quantity) + Number(1);
    await handleQuantityChange(newQuantity);
  };

  const getProduct = async (code) => {
    try {
      let { status, data } = await axios.get(`${API}/product/${code}`);
      setProduct(data);
      setErrorGetProduct({});
      setShowGetProductToast(true);
    } catch (error) {
      for (let errorObject of error.response.data.errors) {
        setErrorGetProduct(errorObject);
        setShowGetProductToast(true);
      }
    }
  };

  useEffect(() => {
    getProduct(code);
  }, [code]);

  return (
    <>
      <div className="col">
        <div className="card w-100">
          <div className="row g-0">
            <div className="col col-4">
              <img
                src={product.productImage}
                className="card-img-top"
                alt="Product Image"
                height={250}
                overflow="hidden"
              />
            </div>
            <div className="col col-8">
              <div className="card-body d-flex flex-column justify-content-between">
                <div className="card-description">
                  <h5 className="card-title">{product.productName}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">{code}</h6>
                  <p className="card-text">{product.productDescription}</p>
                  <p className="card-text">
                    {ProductStatusEnum[product.productStatus]}
                  </p>
                  <p className="card-text">${product.productPrice}</p>
                  <p className="card-text">
                    {product.productPeriod}{" "}
                    {product.productPeriod < 2 ? "month" : "months"}
                  </p>
                </div>
                <div className="card-form container">
                  <div className="row mt-3">
                    <div className="col col-2 d-flex justify-content-center align-items-center">
                      <Button
                        variant="outline-primary"
                        onClick={handleQuantityMinus}
                      >
                        <FaMinus />
                      </Button>
                    </div>
                    <div className="col col-8 d-flex justify-content-center align-items-center">
                      <Form
                        className="cart-order-detail-form w-100"
                        noValidate
                        validated={validated}
                        onSubmit={handleSubmitCartOrderDetail}
                      >
                        <FloatingLabel
                          controlId="floatingInput"
                          label="Quantity"
                        >
                          <Form.Control
                            type="number"
                            name="quantity"
                            value={Number(quantity)}
                            onChange={handleQuantityChange}
                            onWheel={(e) => e.target.blur()}
                            placeholder="Quantity"
                            min={0}
                            required
                          />
                        </FloatingLabel>
                      </Form>
                    </div>
                    <div className="col col-2 d-flex justify-content-center align-items-center">
                      <Button
                        variant="outline-primary"
                        onClick={handleQuantityPlus}
                      >
                        <FaPlus />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <>
        <ToastContainer className="position-fixed p-3 top-0 end-0">
          {Object.keys(errorGetProduct).length > 0 && (
            <Toast
              onClose={() => setShowGetProductToast(false)}
              show={showGetProductToast}
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
              <Toast.Body>{errorGetProduct.message}</Toast.Body>
            </Toast>
          )}
        </ToastContainer>
        <ToastContainer className="position-fixed p-3 top-0 end-0">
          {Object.keys(errorUpdateCartOrderDetail).length > 0 && (
            <Toast
              onClose={() => setShowGetProductToast(false)}
              show={showUpdateCartOrderDetailToast}
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
              <Toast.Body>{errorUpdateCartOrderDetail.message}</Toast.Body>
            </Toast>
          )}
        </ToastContainer>
      </>
    </>
  );
}
