import React, { useEffect, useState } from "react";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/esm/ToastContainer";
import Breadcrumbs from "../components/Breadcrumbs";
import NavbarComponent from "../components/NavbarComponent";
import { API } from "../env/Constants";
import ProductList from "../components/product/ProductList";
import axios from "axios";
import FooterComponent from "../components/FooterComponent";
import { PaginationControl } from "react-bootstrap-pagination-control";

export default function ProductPage() {
  const [cartOrderDetailCount, setCartOrderDetailCount] = useState(0);
  const [showGetProductsToast, setShowGetProductsToast] = useState(false);
  const [errorGetProducts, setErrorGetProducts] = useState({});
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [products, setProducts] = useState([]);

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
        setErrorGetProducts(errorObject);
        setShowGetProductsToast(true);
      }
    }
  };

  useEffect(() => {
    getProducts();
  }, [page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      getProducts();
    }, 5000);

    return () => clearTimeout(timer);
  });

  return (
    <>
      <NavbarComponent cartOrderDetailCount={cartOrderDetailCount} />
      <>
        <Breadcrumbs />
        <ProductList
          products={products}
          getProducts={getProducts}
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

        <div className="product-by-category-footer">
          <FooterComponent />
        </div>
        <ToastContainer className="p-3 top-0 end-0">
          <Toast
            onClose={() => setShowGetProductsToast(false)}
            show={showGetProductsToast}
            delay={3000}
            autohide
          >
            {Object.keys(errorGetProducts).length > 0 && (
              <>
                <Toast.Header className="bg-danger">
                  <img
                    src="holder.js/20x20?text=%20"
                    className="rounded me-2"
                    alt=""
                  />
                  <strong className="me-auto text-light">Error</strong>
                </Toast.Header>
                <Toast.Body>{errorGetProducts.message}</Toast.Body>
              </>
            )}
          </Toast>
        </ToastContainer>
      </>
    </>
  );
}
