/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/esm/ToastContainer';
import Breadcrumbs from '@/components/commons/Breadcrumbs';
import NavbarComponent from '@/components/commons/NavbarComponent';
import CartOrderDetailList from '@/components/cart/CartOrderDetailList';
import FooterComponent from '@/components/commons/FooterComponent';
import Button from 'react-bootstrap/esm/Button';
import { Link } from 'react-router-dom';
import { useCartCheckout, useGetCart } from '@/api/cart';
import useBoundStore from '@/store/store';
import errorHandler from '@/utils/error';
import { OrderDetail } from '@/type/CartDetailResponseType';

export default function CartPage() {
  const [cartOrderDetailCount, setCartOrderDetailCount] = useState(0);
  const [cartOrderDetailTotalPrice, setCartOrderDetailTotalPrice] = useState(0);
  const [showGetCartOrderDetailsToast, setShowGetCartOrderDetailsToast] =
    useState(false);
  const [errorGetCartOrderDetails, setErrorGetCartOrderDetails] = useState<any>(
    {},
  );
  const [showCheckoutToast, setShowCheckoutToast] = useState(false);
  const [errorCheckout, setErrorCheckout] = useState<any>({});

  const cart = useBoundStore.use.cartDetails?.();
  const userToken = useBoundStore.use.userToken?.();
  const setCartOrderDetails = useBoundStore.use.setCartOrderDetails();

  useEffect(() => {
    let counter = Number(0);
    let totaler = Number(0);
    if (cart) {
      for (let i = 0; i < cart.length; i++) {
        counter = Number(counter) + Number(cart[i].quantity);
        totaler =
          Number(totaler) +
          Number(cart[i].productPrice) * Number(cart[i].quantity);
      }
      setCartOrderDetailCount(Number(counter));
      setCartOrderDetailTotalPrice(Number(totaler));
    }
  }, [cart]);

  const {
    data: cartData,
    error: cartError,
    isError: cartIsError,
    isSuccess: cartIsSuccess,
  } = useGetCart({ enabled: !!userToken });

  useEffect(() => {
    if (cartIsSuccess) {
      const cart = (cartData.data.orderDetails || []).sort(
        (a, b) => a.orderDetailId! - b.orderDetailId!,
      );
      setCartOrderDetails(cart as Required<OrderDetail>[]);
      setErrorGetCartOrderDetails({});
      setShowGetCartOrderDetailsToast(true);
    }

    if (cartIsError) {
      errorHandler({
        error: cartError,
        axiosErrorHandlerFn: err => {
          if (err.code === 20) {
            setCartOrderDetails([]);
          }
          setErrorGetCartOrderDetails(err);
          setShowGetCartOrderDetailsToast(true);
        },
        generalErrorHandlerFn: err => {
          setErrorGetCartOrderDetails(err);
          setShowGetCartOrderDetailsToast(true);
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartData, cartError, cartIsError, cartIsSuccess]);

  const cartCheckout = useCartCheckout({
    successSideEffect: () => {
      setErrorCheckout({});
      setShowCheckoutToast(true);
    },
    onError: error => {
      errorHandler({
        error,
        axiosErrorHandlerFn: err => {
          setErrorCheckout(err);
          setShowCheckoutToast(true);
        },
        generalErrorHandlerFn: err => {
          setErrorCheckout(err);
          setShowCheckoutToast(true);
        },
      });
    },
  });

  const handleCheckout = async () => {
    cartCheckout.mutate();
  };

  return (
    <>
      <NavbarComponent cartOrderDetailCount={cartOrderDetailCount} />
      <>
        <Breadcrumbs />
        {cartOrderDetailCount > 0 ? (
          <>
            <div className="container mb-3">
              <div className="row">
                <div className="col col-9">
                  <CartOrderDetailList />
                </div>
                <div className="col col-3 flex-column">
                  <h3>Total amount is ${cartOrderDetailTotalPrice}</h3>
                  <Button variant="outline-primary" onClick={handleCheckout}>
                    Checkout
                  </Button>
                </div>
              </div>
            </div>
            <FooterComponent />
          </>
        ) : (
          <>
            <div className="main-notfound-navbar-breadcrumbs">
              <div className="notfound-content">
                <h3 className="notfound-header">There is no item in Cart.</h3>
                <h4 className="notfound-link">
                  Explore interesting algorithms in{' '}
                  <Link to="/category">Category Page</Link>
                </h4>
                <h4 className="notfound-link">
                  Go to <Link to="/order">Order Page</Link>
                </h4>
              </div>
            </div>
            <div className="cart-footer">
              <FooterComponent position="absolute" color="white" />
            </div>
          </>
        )}
      </>
      <ToastContainer className="position-fixed p-3 top-0 end-0">
        {Object.keys(errorGetCartOrderDetails).length > 0 && (
          <Toast
            onClose={() => setShowGetCartOrderDetailsToast(false)}
            show={showGetCartOrderDetailsToast}
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
            <Toast.Body>{errorGetCartOrderDetails.message}</Toast.Body>
          </Toast>
        )}
      </ToastContainer>
      <ToastContainer className="position-fixed p-3 top-0 end-0">
        {Object.keys(errorCheckout).length > 0 ? (
          <Toast
            onClose={() => setShowCheckoutToast(false)}
            show={showCheckoutToast}
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
            <Toast.Body>{errorCheckout.message}</Toast.Body>
          </Toast>
        ) : (
          <Toast
            onClose={() => setShowCheckoutToast(false)}
            show={showCheckoutToast}
            delay={3000}
            autohide>
            <Toast.Header className="bg-success">
              <img
                src="holder.js/20x20?text=%20"
                className="rounded me-2"
                alt=""
              />
              <strong className="me-auto text-light">Success</strong>
            </Toast.Header>
            <Toast.Body>
              Checkout success! Send payment through our bank account to finish
              your order.
            </Toast.Body>
          </Toast>
        )}
      </ToastContainer>
    </>
  );
}
