/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from 'react';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/esm/ToastContainer';
import useServerCart from '@/hooks/useServerCart';
import { useGetSubscription } from '@/api/subscription';
import { SubscriptionType } from '@/type/SubscriptionType';
import errorHandler from '@/utils/error';
import HeaderTitleComponent from '@/components/commons/HeaderTitleComponent';
import useBoundStore from '@/store/store';
import Inference from '@/components/inference/Inference';
import { Select } from '@mantine/core';

const InferencePage = () => {
  const [showGetSubscriptionsToast, setShowGetSubscriptionsToast] =
    useState(false);
  const [errorGetSubscriptions, setErrorGetSubscriptions] = useState({});
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [page, setPage] = useState(1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [size, setSize] = useState(6);
  const [algorithm, setAlgorithm] = useState<string | null>();

  const stockCode = useBoundStore.use.stockCode();

  const {
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

  const subscriptionMap = useMemo(() => {
    const map: { [key: string]: SubscriptionType[] } = {};
    subscriptionData?.data.content.forEach(val => {
      if (
        !Object.prototype.hasOwnProperty.call(map, val.productCategoryCode!)
      ) {
        map[val.productCategoryCode!] = [val];
      } else {
        map[val.productCategoryCode!].push(val);
      }
    });

    return map;
  }, [subscriptionData]);

  const algorithms = useMemo(() => {
    if (!subscriptionData?.data.content) {
      return;
    }

    const set = new Set(
      subscriptionData?.data.content.map(val => val.productCategoryCode || ''),
    );

    return Array.from(set);
  }, [subscriptionData]);

  return (
    <>
      <HeaderTitleComponent
        title={'Forecasting'}
        divider={true}
        stockCode={stockCode}
      />
      <>
        <div className="container mb-3">
          <Select
            label="Select Algorithm"
            placeholder="Pick value"
            data={algorithms}
            className="tw-pb-4 tw"
            maxDropdownHeight={200}
            comboboxProps={{ shadow: 'xl' }}
            onChange={setAlgorithm}
          />
          <div className="row row-cols-1 g-4" id="subscriptions-row">
            {!!subscriptionMap &&
              !!algorithm &&
              subscriptionMap[algorithm].map(val => (
                <Inference
                  stockCode={stockCode}
                  productCategoryCode={algorithm}
                  expTime={val.expTime}
                />
              ))}
          </div>
        </div>
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
