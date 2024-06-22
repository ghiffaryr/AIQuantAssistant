/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/esm/ToastContainer';
import Breadcrumbs from '@/components/commons/Breadcrumbs';
import NavbarComponent from '@/components/commons/NavbarComponent';
import CategoryList from '@/components/category/CategoryList';
import FooterComponent from '@/components/commons/FooterComponent';
import { PaginationControl } from 'react-bootstrap-pagination-control';
import { Button } from 'react-bootstrap';
import CreateCategoryModal from '@/components/category/CreateCategoryModal';
import useServerCart from '@/hooks/useServerCart';
import { useGetCategory } from '@/api/category';
import { CategoryDetailType } from '@/type/CategoryType';
import errorHandler from '@/utils/error';
import useBoundStore from '@/store/store';
import Role from '@/enums/RoleEnum';

export default function CategoryPage() {
  const [showGetCategoriesToast, setShowGetCategoriesToast] = useState(false);
  const [errorGetCategories, setErrorGetCategories] = useState({});
  const [page, setPage] = useState(1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [size, setSize] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState<CategoryDetailType[]>([]);
  const [showCreateCategoryModal, setShowCreateCategoryModal] = useState(false);

  const {
    cartOrderDetailCount,
    errorGetServerCart,
    setShowGetServerCartToast,
    showGetServerCartToast,
  } = useServerCart();

  const {
    data: categoryData,
    error: categoryError,
    isError: categoryIsError,
    isSuccess: categoryIsSuccess,
  } = useGetCategory(page, size, {
    enabled: true,
  });

  const userRole = useBoundStore.use.userRole?.();

  useEffect(() => {
    if (categoryIsSuccess) {
      setCategories(categoryData.data.content!);
      setTotalPages(categoryData.data.totalPages!);
      setErrorGetCategories({});
      setShowGetCategoriesToast(true);
    }

    if (categoryIsError) {
      errorHandler({
        error: categoryError,
        axiosErrorHandlerFn: err => {
          if (err.code === 30) {
            setCategories([]);
          }
          setErrorGetCategories(err);
          setShowGetCategoriesToast(true);
        },
        generalErrorHandlerFn: err => {
          setErrorGetCategories({ message: err.message });
          setShowGetCategoriesToast(true);
        },
      });
    }
  }, [categoryData, categoryError, categoryIsError, categoryIsSuccess]);

  return (
    <>
      <NavbarComponent cartOrderDetailCount={cartOrderDetailCount} />
      <>
        <Breadcrumbs />
        {userRole == Role.Manager && (
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
            <Toast.Body>{(errorGetCategories as any).message}</Toast.Body>
          </Toast>
        )}
      </ToastContainer>
      <>
        <CreateCategoryModal
          show={showCreateCategoryModal}
          onHide={() => setShowCreateCategoryModal(false)}
        />
      </>
    </>
  );
}
