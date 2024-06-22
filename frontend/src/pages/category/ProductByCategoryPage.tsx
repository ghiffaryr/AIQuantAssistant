/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/esm/ToastContainer';
import Breadcrumbs from '@/components/commons/Breadcrumbs';
import NavbarComponent from '@/components/commons/NavbarComponent';
import ProductList from '@/components/product/ProductList';
import FooterComponent from '@/components/commons/FooterComponent';
import { PaginationControl } from 'react-bootstrap-pagination-control';
import { useParams } from 'react-router-dom';
import useServerCart from '@/hooks/useServerCart';
import {
  useGetProductCategory,
  useGetProductCategoryOnsale,
} from '@/api/category';
import useBoundStore from '@/store/store';
import { ProductDataType } from '@/type/ProductDataType';
import errorHandler from '@/utils/error';

const ProductByCategoryPage = () => {
  const [showGetProductsByCategoryToast, setShowGetProductsByCategoryToast] =
    useState(false);
  const [errorGetProductsByCategory, setErrorGetProductsByCategory] = useState(
    {},
  );
  const [page, setPage] = useState(1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [size, setSize] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [products, setProducts] = useState<ProductDataType[]>([]);

  const {
    cartOrderDetailCount,
    errorGetServerCart,
    setShowGetServerCartToast,
    showGetServerCartToast,
  } = useServerCart();

  const { code: productCategoryCode } = useParams();

  const userRole = useBoundStore.use.userRole?.();

  const {
    data: productCategoryData,
    error: productCategoryError,
    isError: productCategoryIsError,
    isSuccess: productCategoryIsSuccess,
  } = useGetProductCategory(productCategoryCode!, page, size, {
    enabled: userRole === 'ROLE_EMPLOYEE' || userRole === 'ROLE_MANAGER',
  });

  useEffect(() => {
    if (productCategoryIsSuccess) {
      setProducts(productCategoryData.data.page?.content || []);
      setTotalPages(productCategoryData.data.page?.totalPages || 0);
      setErrorGetProductsByCategory({});
      setShowGetProductsByCategoryToast(true);
    }

    if (productCategoryIsError) {
      errorHandler({
        error: productCategoryError,
        axiosErrorHandlerFn: err => {
          setErrorGetProductsByCategory(err);
          setShowGetProductsByCategoryToast(true);
        },
        generalErrorHandlerFn: err => {
          setErrorGetProductsByCategory({ message: err.message });
          setShowGetProductsByCategoryToast(true);
        },
      });
    }
  }, [
    productCategoryData,
    productCategoryError,
    productCategoryIsError,
    productCategoryIsSuccess,
  ]);

  const {
    data: productCategoryOnsaleData,
    error: productCategoryOnsaleError,
    isError: productCategoryOnsaleDataIsError,
    isSuccess: productCategoryOnsaleDataIsSuccess,
  } = useGetProductCategoryOnsale(productCategoryCode!, page, size, {
    enabled: !(userRole === 'ROLE_EMPLOYEE' || userRole === 'ROLE_MANAGER'),
  });

  useEffect(() => {
    if (productCategoryOnsaleDataIsSuccess) {
      setProducts(productCategoryOnsaleData.data.page?.content || []);
      setTotalPages(productCategoryOnsaleData.data.page?.totalPages || 0);
      setErrorGetProductsByCategory({});
      setShowGetProductsByCategoryToast(true);
    }

    if (productCategoryOnsaleDataIsError) {
      errorHandler({
        error: productCategoryOnsaleError,
        axiosErrorHandlerFn: err => {
          setErrorGetProductsByCategory(err);
          setShowGetProductsByCategoryToast(true);
        },
        generalErrorHandlerFn: err => {
          setErrorGetProductsByCategory({ message: err.message });
          setShowGetProductsByCategoryToast(true);
        },
      });
    }
  }, [
    productCategoryOnsaleData,
    productCategoryOnsaleError,
    productCategoryOnsaleDataIsError,
    productCategoryOnsaleDataIsSuccess,
  ]);

  return (
    <>
      <NavbarComponent cartOrderDetailCount={cartOrderDetailCount} />
      <>
        <Breadcrumbs />
        <ProductList products={products} setProducts={setProducts} />
        <PaginationControl
          page={page}
          between={4}
          total={totalPages}
          limit={1}
          changePage={page => {
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
            autohide>
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
            autohide>
            <Toast.Header className="bg-danger">
              <img
                src="holder.js/20x20?text=%20"
                className="rounded me-2"
                alt=""
              />
              <strong className="me-auto text-light">Error</strong>
            </Toast.Header>
            <Toast.Body>
              {(errorGetProductsByCategory as any).message}
            </Toast.Body>
          </Toast>
        )}
      </ToastContainer>
    </>
  );
};

export default ProductByCategoryPage;
