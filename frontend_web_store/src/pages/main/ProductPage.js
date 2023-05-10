import React, { useEffect, useState } from "react";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/esm/ToastContainer";
import Breadcrumbs from "../../components/basic/Breadcrumbs";
import NavbarComponent from "../../components/basic/NavbarComponent";
import { API } from "../../env/Constants";
import ProductList from "../../components/product/ProductList";
import axios from "axios";
import FooterComponent from "../../components/basic/FooterComponent";
import { PaginationControl } from "react-bootstrap-pagination-control";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { Button } from "react-bootstrap";
import CreateProductModal from "../../components/product/CreateProductModal";

export default function ProductPage() {
  const [showGetServerCartToast, setShowGetServerCartToast] = useState(false);
  const [errorGetServerCart, setErrorGetServerCart] = useState({});
  const [cartOrderDetailCount, setCartOrderDetailCount] = useState(0);
  const [showGetProductsToast, setShowGetProductsToast] = useState(false);
  const [errorGetProducts, setErrorGetProducts] = useState({});
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [products, setProducts] = useState([]);
  const [inputs, setInputs] = useState({ query: "" });
  const [showCreateProductModal, setShowCreateProductModal] = useState(false);

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

  const getProducts = async () => {
    try {
      let { status, data } = await axios.get(
        localStorage.getItem("userRole") === "ROLE_EMPLOYEE" ||
          localStorage.getItem("userRole") === "ROLE_MANAGER"
          ? `${API}/product`
          : `${API}/product/onsale`,
        {
          params: { page: page, size: size },
        }
      );
      setProducts(data.content);
      setTotalPages(data.totalPages);
      setErrorGetProducts({});
      setShowGetProductsToast(true);
    } catch (error) {
      for (let errorObject of error.response.data.errors) {
        if (errorObject.code === 10) {
          setProducts([]);
        }
        setErrorGetProducts(errorObject);
        setShowGetProductsToast(true);
      }
    }
  };

  useEffect(() => {
    getServerCart();
    getProducts();
  }, [page]);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     getServerCart();
  //     getProducts();
  //   }, 5000);

  //   return () => clearTimeout(timer);
  // });

  function handleChange(e) {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  }

  const onSubmitSearch = async (e) => {
    console.log(e.target[0].value);
    e.preventDefault();
    if (e.target[0].value.trim().length > 0) {
      try {
        let { status, data } = await axios.get(
          `${API}/search`,
          localStorage.getItem("userRole") === "ROLE_EMPLOYEE" ||
            localStorage.getItem("userRole") === "ROLE_MANAGER"
            ? {
                params: { query: e.target[0].value, page: page, size: size },
              }
            : {
                params: {
                  query: e.target[0].value,
                  productStatus: 1,
                  page: page,
                  size: size,
                },
              }
        );
        setProducts(data.content);
        setTotalPages(data.totalPages);
        setErrorGetProducts({});
        setShowGetProductsToast(true);
      } catch (error) {
        for (let errorObject of error.response.data.errors) {
          if (errorObject.code === 10) {
            setProducts([]);
          }
          setErrorGetProducts(errorObject);
          setShowGetProductsToast(true);
        }
      }
    } else {
      getProducts();
    }
  };

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
        <div className="container mb-3">
          <Form className="search-form" noValidate onSubmit={onSubmitSearch}>
            <InputGroup className="rounded-pill mb-3">
              <Form.Control
                type="text"
                name="query"
                value={inputs.search}
                onChange={handleChange}
                placeholder="Search..."
                aria-label="Search..."
              />
            </InputGroup>
          </Form>
        </div>
        {localStorage.getItem("userRole") == "ROLE_MANAGER" && (
          <div className="container mb-3">
            <Button
              className="w-100"
              variant="outline-primary"
              onClick={() => setShowCreateProductModal(true)}
            >
              Create Product
            </Button>
          </div>
        )}
        <ProductList
          products={products}
          setProducts={setProducts}
          setCartOrderDetailCount={setCartOrderDetailCount}
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
        {Object.keys(errorGetProducts).length > 0 && (
          <Toast
            onClose={() => setShowGetProductsToast(false)}
            show={showGetProductsToast}
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
            <Toast.Body>{errorGetProducts.message}</Toast.Body>
          </Toast>
        )}
      </ToastContainer>
      <>
        <CreateProductModal
          getProducts={getProducts}
          show={showCreateProductModal}
          onHide={() => setShowCreateProductModal(false)}
        />
      </>
    </>
  );
}
