import React, { useEffect, useState } from "react";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/esm/ToastContainer";
import Breadcrumbs from "../../components/basic/Breadcrumbs";
import NavbarComponent from "../../components/basic/NavbarComponent";
import { API } from "../../env/Constants";
import CategoryList from "../../components/category/CategoryList";
import axios from "axios";
import FooterComponent from "../../components/basic/FooterComponent";
import { PaginationControl } from "react-bootstrap-pagination-control";
import { Button } from "react-bootstrap";
import CreateCategoryModal from "../../components/category/CreateCategoryModal";

export default function CategoryPage() {
  const [showGetServerCartToast, setShowGetServerCartToast] = useState(false);
  const [errorGetServerCart, setErrorGetServerCart] = useState({});
  const [cartOrderDetailCount, setCartOrderDetailCount] = useState(0);
  const [showGetCategoriesToast, setShowGetCategoriesToast] = useState(false);
  const [errorGetCategories, setErrorGetCategories] = useState({});
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState([]);
  const [showCreateCategoryModal, setShowCreateCategoryModal] = useState(false);

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

  const getCategories = async () => {
    try {
      let { status, data } = await axios.get(`${API}/category`, {
        params: { page: page, size: size },
      });
      setCategories(data.content);
      setTotalPages(data.totalPages);
      setErrorGetCategories({});
      setShowGetCategoriesToast(true);
    } catch (error) {
      for (let errorObject of error.response.data.errors) {
        if (errorObject.code === 30) {
          setCategories([]);
        }
        setErrorGetCategories(errorObject);
        setShowGetCategoriesToast(true);
      }
    }
  };

  useEffect(() => {
    getServerCart();
    getCategories();
  }, [page]);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     getServerCart();
  //     getCategories();
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
        {localStorage.getItem("userRole") == "ROLE_MANAGER" && (
          <div className="container mb-3">
            <Button
              className="w-100"
              variant="outline-primary"
              onClick={() => setShowCreateCategoryModal(true)}
            >
              Create Category
            </Button>
          </div>
        )}
        <CategoryList categories={categories} setCategories={setCategories} />
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
        <div className="category-footer">
          <FooterComponent />
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
      <ToastContainer className="position-fixed p-3 top-0 end-0">
        {Object.keys(errorGetCategories).length > 0 && (
          <Toast
            onClose={() => setShowGetCategoriesToast(false)}
            show={showGetCategoriesToast}
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
            <Toast.Body>{errorGetCategories.message}</Toast.Body>
          </Toast>
        )}
      </ToastContainer>
      <>
        <CreateCategoryModal
          getCategories={getCategories}
          show={showCreateCategoryModal}
          onHide={() => setShowCreateCategoryModal(false)}
        />
      </>
    </>
  );
}
