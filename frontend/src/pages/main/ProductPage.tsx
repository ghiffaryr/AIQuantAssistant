/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/esm/ToastContainer';
import Breadcrumbs from '@/components/commons/Breadcrumbs';
import NavbarComponent from '@/components/commons/NavbarComponent';
import ProductList from '../../components/product/ProductList';
import FooterComponent from '@/components/commons/FooterComponent';
import { PaginationControl } from 'react-bootstrap-pagination-control';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { Button } from 'react-bootstrap';
import CreateProductModal from '../../components/product/CreateProductModal';
import useServerCart from '@/hooks/useServerCart';
import {
  useGetProduct,
  useGetProductOnsale,
  useSearchProduct,
} from '@/api/product';
import useBoundStore from '@/store/store';
import Role from '@/enums/RoleEnum';
import errorHandler from '@/utils/error';
import { ProductDataType } from '@/type/ProductDataType';
import { EProductStatus } from '@/enums/ProductStatusEnum';
import { MappedType } from '@/utils/type';

export default function ProductPage() {
  const [showGetProductsToast, setShowGetProductsToast] = useState(false);
  const [errorGetProducts, setErrorGetProducts] = useState({});
  const [page, setPage] = useState(1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [size, setSize] = useState(6);
  const [searchVal, setSearchVal] = useState();
  const [totalPages, setTotalPages] = useState(1);
  const [products, setProducts] = useState<ProductDataType[]>([]);
  const [inputs, setInputs] = useState<MappedType<string, string>>({
    query: '',
  });
  const [showCreateProductModal, setShowCreateProductModal] = useState(false);

  const {
    cartOrderDetailCount,
    errorGetServerCart,
    setShowGetServerCartToast,
    showGetServerCartToast,
  } = useServerCart();

  const userRole = useBoundStore.use.userRole?.();

  const {
    data: productData,
    error: productError,
    isError: productIsError,
    isSuccess: productIsSuccess,
    refetch: refetchProduct,
  } = useGetProduct(page, size, {
    enabled: userRole == Role.Employee || userRole == Role.Manager,
  });

  const {
    data: productOnsaleData,
    error: productOnsaleError,
    isError: productOnsaleIsError,
    isSuccess: productOnsaleIsSuccess,
  } = useGetProductOnsale(page, size, {
    enabled: !(userRole == Role.Employee || userRole == Role.Manager),
  });

  useEffect(() => {
    if (productIsSuccess) {
      setProducts(productData?.data.content ?? []);
      setTotalPages(productData?.data.totalPages ?? 0);
      setErrorGetProducts({});
      setShowGetProductsToast(true);
    }

    if (productIsError) {
      errorHandler({
        error: productError,
        axiosErrorHandlerFn: err => {
          if (err.code === 10) {
            setProducts([]);
          }
          setErrorGetProducts(err);
          setShowGetProductsToast(true);
        },
        generalErrorHandlerFn: err => {
          setErrorGetProducts({ message: err.message });
          setShowGetProductsToast(true);
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productData, productError, productIsError, productIsSuccess]);

  useEffect(() => {
    if (productOnsaleIsSuccess) {
      setProducts(productOnsaleData?.data.content ?? []);
      setTotalPages(productOnsaleData?.data.totalPages ?? 0);
      setErrorGetProducts({});
      setShowGetProductsToast(true);
    }

    if (productOnsaleIsError) {
      errorHandler({
        error: productOnsaleError,
        axiosErrorHandlerFn: err => {
          if (err.code === 10) {
            setProducts([]);
          }
          setErrorGetProducts(err);
          setShowGetProductsToast(true);
        },
        generalErrorHandlerFn: err => {
          setErrorGetProducts({ message: err.message });
          setShowGetProductsToast(true);
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    productOnsaleData,
    productOnsaleError,
    productOnsaleIsError,
    productOnsaleIsSuccess,
  ]);

  const {
    data: emsProductData,
    error: emsProductError,
    isError: emsProductIsError,
    isSuccess: emsProductIsSuccess,
    refetch: emsProductRefetch,
  } = useSearchProduct(
    { query: searchVal, page: page, size: size },
    { enabled: false },
  );

  const {
    data: sProductData,
    error: sProductError,
    isError: sProducIsError,
    isSuccess: sProducIsSuccess,
    refetch: sProductRefetch,
  } = useSearchProduct(
    {
      productStatus: EProductStatus.Unavailable,
      query: searchVal,
      page: page,
      size: size,
    },
    { enabled: false },
  );

  useEffect(() => {
    if (!searchVal) return;
    if (userRole === Role.Employee || userRole === Role.Manager) {
      emsProductRefetch();
      return;
    }

    sProductRefetch();
  }, [searchVal]);

  useEffect(() => {
    if (emsProductIsSuccess) {
      setProducts(emsProductData.data.content!);
      setTotalPages(emsProductData.data.totalPages!);
      setErrorGetProducts({});
      setShowGetProductsToast(true);
    }

    if (emsProductError) {
      errorHandler({
        error: emsProductError,
        axiosErrorHandlerFn: err => {
          if (err.code === 10) {
            setProducts([]);
          }
          setErrorGetProducts(err);
          setShowGetProductsToast(true);
        },
        generalErrorHandlerFn: err => {
          setErrorGetProducts(err);
          setShowGetProductsToast(true);
        },
      });
    }
  }, [emsProductData, emsProductError, emsProductIsError, emsProductIsSuccess]);

  useEffect(() => {
    if (sProducIsSuccess) {
      setProducts(sProductData.data.content!);
      setTotalPages(sProductData.data.totalPages!);
      setErrorGetProducts({});
      setShowGetProductsToast(true);
    }

    if (sProductError) {
      errorHandler({
        error: sProductError,
        axiosErrorHandlerFn: err => {
          if (err.code === 10) {
            setProducts([]);
          }
          setErrorGetProducts(err);
          setShowGetProductsToast(true);
        },
        generalErrorHandlerFn: err => {
          setErrorGetProducts(err);
          setShowGetProductsToast(true);
        },
      });
    }
  }, [sProductData, sProductError, sProducIsError, sProducIsSuccess]);

  function handleChange(e: any) {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  }

  const onSubmitSearch = async (e: any) => {
    e.preventDefault();

    if (e.target[0].value.trim().length > 0) {
      setSearchVal(e.target[0].value);
    } else {
      refetchProduct();
    }
  };

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
        {userRole == 'ROLE_MANAGER' && (
          <div className="container mb-3">
            <Button
              className="w-100"
              variant="outline-primary"
              onClick={() => setShowCreateProductModal(true)}>
              Create Product
            </Button>
          </div>
        )}
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
        {Object.keys(errorGetProducts).length > 0 && (
          <Toast
            onClose={() => setShowGetProductsToast(false)}
            show={showGetProductsToast}
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
            <Toast.Body>{(errorGetProducts as any).message}</Toast.Body>
          </Toast>
        )}
      </ToastContainer>
      <>
        <CreateProductModal
          show={showCreateProductModal}
          onHide={() => setShowCreateProductModal(false)}
        />
      </>
    </>
  );
}
