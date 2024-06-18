/* eslint-disable react-hooks/exhaustive-deps */
import { useGetCart } from '@/api/cart';
import Role from '@/enums/RoleEnum';
import useBoundStore from '@/store/store';
import axios from 'axios';
import { useEffect, useState } from 'react';

const useServerCart = () => {
  const [showGetServerCartToast, setShowGetServerCartToast] = useState(false);
  const [errorGetServerCart, setErrorGetServerCart] = useState({});
  const [cartOrderDetailCount, setCartOrderDetailCount] = useState(0);

  const userRole = useBoundStore.use.userRole?.();
  const setCartOrderDetails = useBoundStore.use.setCartOrderDetails?.();
  const cartDetails = useBoundStore.use.cartDetails();

  const {
    data: cartData,
    error: cartError,
    isError: cartIsError,
    isSuccess: cartIsSuccess,
  } = useGetCart({ enabled: userRole === Role.Customer });

  useEffect(() => {
    if (cartIsSuccess) {
      const cart = [];
      for (const orderDetail of cartData.data?.orderDetails || []) {
        cart.push({
          orderDetailId: orderDetail.orderDetailId || 0,
          productCode: orderDetail.productCode || '',
          productPrice: orderDetail.productPrice || 0,
          quantity: orderDetail.quantity || 0,
        });
      }
      setCartOrderDetails(cart);
      setErrorGetServerCart({});
      setShowGetServerCartToast(false);
      return;
    }

    if (cartIsError) {
      if (axios.isAxiosError(cartError)) {
        for (const errorObject of (cartError.response || { data: [] }).data
          .errors) {
          setErrorGetServerCart(errorObject);
          setShowGetServerCartToast(true);
        }
      }

      setErrorGetServerCart({ message: cartError.message });
      setShowGetServerCartToast(true);
    }
  }, [cartData, cartError, cartIsError, cartIsSuccess]);

  useEffect(() => {
    let counter = 0;
    if (cartDetails) {
      for (let i = 0; i < cartDetails.length; i++) {
        counter = counter + Number(cartDetails[i].quantity);
      }
      setCartOrderDetailCount(counter);
    }
  }, [cartDetails]);

  return {
    showGetServerCartToast,
    errorGetServerCart,
    cartOrderDetailCount,
    setShowGetServerCartToast,
  };
};

export default useServerCart;
