import React, { useEffect, useState } from "react";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/esm/ToastContainer";
import Breadcrumbs from "../../../components/basic/Breadcrumbs";
import NavbarComponent from "../../../components/basic/NavbarComponent";
import { API } from "../../../env/Constants";
import ProductList from "../../../components/product/ProductList";
import axios from "axios";
import FooterComponent from "../../../components/basic/FooterComponent";
import { PaginationControl } from "react-bootstrap-pagination-control";

export default function ProductByCategoryPage() {
  const [showGetServerCartToast, setShowGetServerCartToast] = useState(false);
  const [errorGetServerCart, setErrorGetServerCart] = useState({});
  const [cartOrderDetailCount, setCartOrderDetailCount] = useState(0);
  const [showGetProductsByCategoryToast, setShowGetProductsByCategoryToast] =
    useState(false);
  const [errorGetProductsByCategory, setErrorGetProductsByCategory] = useState(
    {}
  );
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [products, setProducts] = useState([]);

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

  const getProductsByCategory = async () => {
    try {
      const productCategoryCode = window.location.pathname.substring(
        window.location.pathname.lastIndexOf("/") + 1
      );
      let { status, data } = await axios.get(
        localStorage.getItem("userRole") === "ROLE_EMPLOYEE" ||
          localStorage.getItem("userRole") === "ROLE_MANAGER"
          ? `${API}/category/${productCategoryCode}/product`
          : `${API}/category/${productCategoryCode}/product/onsale`,
        {
          params: { page: page, size: size },
        }
      );
      setProducts(data.page.content);
      setTotalPages(data.totalPages);
      setErrorGetProductsByCategory({});
      setShowGetProductsByCategoryToast(true);
    } catch (error) {
      for (let errorObject of error.response.data.errors) {
        setErrorGetProductsByCategory(errorObject);
        setShowGetProductsByCategoryToast(true);
      }
    }
  };

  useEffect(() => {
    getServerCart();
    getProductsByCategory();
  }, [page]);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     getServerCart();
  //     getProductsByCategory();
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
        {Object.keys(errorGetProductsByCategory).length > 0 && (
          <Toast
            onClose={() => setShowGetProductsByCategoryToast(false)}
            show={showGetProductsByCategoryToast}
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
            <Toast.Body>{errorGetProductsByCategory.message}</Toast.Body>
          </Toast>
        )}
      </ToastContainer>
    </>
  );
}
