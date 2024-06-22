/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/esm/ToastContainer';
import Breadcrumbs from '@/components/commons/Breadcrumbs';
import FooterComponent from '@/components/commons/FooterComponent';
import NavbarComponent from '@/components/commons/NavbarComponent';
import SubscriptionList from '../../components/inference/InferenceList';
import { PaginationControl } from 'react-bootstrap-pagination-control';
import useServerCart from '@/hooks/useServerCart';
import { useGetSubscription } from '@/api/subscription';
import { SubscriptionType } from '@/type/SubscriptionType';
import errorHandler from '@/utils/error';

const InferencePage = () => {
  const [showGetSubscriptionsToast, setShowGetSubscriptionsToast] =
    useState(false);
  const [errorGetSubscriptions, setErrorGetSubscriptions] = useState({});
  const [page, setPage] = useState(1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [size, setSize] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [subscriptions, setSubscriptions] = useState<SubscriptionType[]>([]);

  const {
    cartOrderDetailCount,
    errorGetServerCart,
    setShowGetServerCartToast,
    showGetServerCartToast,
  } = useServerCart();

  const {
    data: subscriptionData,
    error: subscriptionError,
    isError: subscriptionIsError,
    isSuccess: subscriptionIsSuccess,
  } = useGetSubscription(page, size, { enabled: true });

  useEffect(() => {
    if (subscriptionIsSuccess) {
      setSubscriptions(subscriptionData.data.content || []);
      setTotalPages(subscriptionData.data.totalPages!);
      setErrorGetSubscriptions({});
      setShowGetSubscriptionsToast(true);
    }

    if (subscriptionIsError) {
      errorHandler({
        error: subscriptionError,
        axiosErrorHandlerFn: err => {
          setErrorGetSubscriptions(err);
          setShowGetSubscriptionsToast(true);
        },
        generalErrorHandlerFn: err => {
          setErrorGetSubscriptions({ message: err.message });
          setShowGetSubscriptionsToast(true);
        },
      });
    }
  }, [
    subscriptionData,
    subscriptionError,
    subscriptionIsError,
    subscriptionIsSuccess,
  ]);

  return (
    <>
      <NavbarComponent cartOrderDetailCount={cartOrderDetailCount} />
      <>
        <Breadcrumbs />
        <div className="container mb-4 d-flex align-items-center">
          <small>
            <span className="text-danger">*</span> Search for Stock Code at
            Yahoo Finance
          </small>
        </div>
        <SubscriptionList subscriptions={subscriptions} />
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
        {Object.keys(errorGetSubscriptions).length > 0 && (
          <Toast
            onClose={() => setShowGetSubscriptionsToast(false)}
            show={showGetSubscriptionsToast}
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
            <Toast.Body>{(errorGetSubscriptions as any).message}</Toast.Body>
          </Toast>
        )}
      </ToastContainer>
    </>
  );
};

export default InferencePage;
