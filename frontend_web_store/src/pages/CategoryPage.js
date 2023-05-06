import React, { useEffect, useState } from "react";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/esm/ToastContainer";
import Breadcrumbs from "../components/Breadcrumbs";
import NavbarComponent from "../components/NavbarComponent";
import { API } from "../env/Constants";
import CategoryList from "../components/category/CategoryList";
import axios from "axios";
import FooterComponent from "../components/FooterComponent";
import { PaginationControl } from "react-bootstrap-pagination-control";

export default function CategoryPage() {
  const [cartOrderDetailCount, setCartOrderDetailCount] = useState(0);
  const [showGetCategoriesToast, setShowGetCategoriesToast] = useState(false);
  const [errorGetCategories, setErrorGetCategories] = useState({});
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart"));
    let counter = Number(0);
    if (cart) {
      for (let i = 0; i < cart.length; i++) {
        counter = Number(counter) + Number(cart[i].quantity);
      }
      setCartOrderDetailCount(Number(counter));
    }
  }, [JSON.parse(localStorage.getItem("cart"))]);

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
        setErrorGetCategories(errorObject);
        setShowGetCategoriesToast(true);
      }
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      getCategories();
    }, 5000);

    return () => clearTimeout(timer);
  });

  return (
    <>
      <NavbarComponent cartOrderDetailCount={cartOrderDetailCount} />
      <>
        <Breadcrumbs />
        <CategoryList categories={categories} getCategories={getCategories} />
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
        <ToastContainer className="p-3 top-0 end-0">
          <Toast
            onClose={() => setShowGetCategoriesToast(false)}
            show={showGetCategoriesToast}
            delay={3000}
            autohide
          >
            {Object.keys(errorGetCategories).length > 0 && (
              <>
                <Toast.Header className="bg-danger">
                  <img
                    src="holder.js/20x20?text=%20"
                    className="rounded me-2"
                    alt=""
                  />
                  <strong className="me-auto text-light">Error</strong>
                </Toast.Header>
                <Toast.Body>{errorGetCategories.message}</Toast.Body>
              </>
            )}
          </Toast>
        </ToastContainer>
      </>
    </>
  );
}
