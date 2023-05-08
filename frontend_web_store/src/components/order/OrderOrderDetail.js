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

export default function OrderOrderDetail({ id, code, price, quantity }) {
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
        <div className="card h-100">
          <img
            src={product.productImage}
            className="card-img-top"
            alt="Product Image"
            height={250}
            overflow="hidden"
          />
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
      </>
    </>
  );
}
