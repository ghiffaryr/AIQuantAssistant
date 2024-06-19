/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '@/style/pages/main/LoginPage.css';
import useBoundStore from '@/store/store';
import { useGetProfile, useLoginMutation } from '@/api/auth';
import { useGetCart } from '@/api/cart';
import { CartDetailsType } from '@/store/storeType';
import Role from '@/enums/RoleEnum';
import errorHandler from '@/utils/error';

const useLogin = () => {
  const [inputs, setInputs] = useState({ email: '', password: '' });
  const [showLoginToast, setShowLoginToast] = useState(false);
  const [errorLogin, setErrorLogin] = useState<any>({});
  const [showGetServerCartToast, setShowGetServerCartToast] = useState(false);
  const [errorGetServerCart, setErrorGetServerCart] = useState<any>({});
  const location = useLocation();
  const navigate = useNavigate();

  const setUserData = useBoundStore.use.setUserData();
  const removeUserData = useBoundStore.use.removeUserData();
  const setCartOrderDetails = useBoundStore.use.setCartOrderDetails();
  const userToken = useBoundStore.use.userToken?.();
  const userRole = useBoundStore.use.userRole?.();

  const {
    refetch: refetchProfile,
    data: profileData,
    error: profileError,
    isError: profileIsError,
    isSuccess: profileIsSuccess,
  } = useGetProfile({ enabled: false });
  const {
    refetch: refetchCart,
    data: cartData,
    error: cartError,
    isError: cartIsError,
    isSuccess: cartIsSuccess,
  } = useGetCart({ enabled: false });
  const loginMutate = useLoginMutation({
    onSuccess: async val => {
      setUserData({
        userEmail: val.data.email,
        userToken: val.data.token,
        tokenType: val.data.type,
      });
      setErrorLogin({});
      setShowLoginToast(true);
    },
    onError: error => {
      setInputs({ ...inputs, password: '' });
      removeUserData();

      errorHandler({
        axiosErrorHandlerFn: err => {
          setErrorLogin(err);
          setShowLoginToast(true);
        },
        generalErrorHandlerFn: err => {
          setErrorLogin({ message: err.message });
          setShowLoginToast(true);
        },
        error,
      });
    },
  });

  useEffect(() => {
    if (userToken) {
      refetchProfile();
    }
  }, [userToken]);

  useEffect(() => {
    if (userRole === Role.Customer) {
      refetchCart();
    }
  }, [userRole]);

  useEffect(() => {
    if (!profileIsSuccess || !cartIsSuccess) {
      return;
    }

    setTimeout(() => {
      if (location.state) {
        navigate(`${(location.state as any).from.pathname}`);
      } else {
        navigate('/');
      }
    }, 3000);
  }, [profileIsSuccess, cartIsSuccess]);

  useEffect(() => {
    if (profileIsSuccess) {
      setUserData({
        userAddress: profileData.data.address,
        userBirthdate: profileData.data.birthdate,
        userCreateTime: profileData.data.createTime,
        userGender: profileData.data.gender,
        userImage: profileData.data.image,
        userName: profileData.data.name,
        userPhone: profileData.data.phone,
        userRole: profileData.data.role,
        userUpdateTime: profileData.data.updateTime,
      });
      setErrorLogin({});
      setShowLoginToast(true);
      return;
    }

    if (profileIsError) {
      removeUserData();
      errorHandler({
        error: profileError,
        axiosErrorHandlerFn: err => {
          setErrorLogin(err);
          setShowLoginToast(true);
        },
        generalErrorHandlerFn: err => {
          setErrorLogin({ message: err?.message });
          setShowLoginToast(true);
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, profileError, profileIsError, profileIsSuccess]);

  useEffect(() => {
    if (cartIsSuccess) {
      const cart: CartDetailsType[] = [];
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
      errorHandler({
        error: cartError,
        axiosErrorHandlerFn: err => {
          setErrorGetServerCart(err);
          setShowGetServerCartToast(true);
        },
        generalErrorHandlerFn: err => {
          setErrorGetServerCart({ message: err?.message });
          setShowGetServerCartToast(true);
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartData, cartError, cartIsError, cartIsSuccess]);

  const login = async () => {
    loginMutate.mutate({ email: inputs.email, password: inputs.password });
  };

  return {
    inputs,
    setInputs,
    login,
    userToken,
    setShowLoginToast,
    errorLogin,
    showLoginToast,
    errorGetServerCart,
    setShowGetServerCartToast,
    showGetServerCartToast,
  };
};

export default useLogin;
