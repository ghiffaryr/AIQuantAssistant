/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import FloatingLabel from 'react-bootstrap/esm/FloatingLabel';
import ToastContainer from 'react-bootstrap/esm/ToastContainer';
import Toast from 'react-bootstrap/Toast';
import Form from 'react-bootstrap/Form';
import { FaPlus, FaMinus } from 'react-icons/fa';
import ProductStatusEnum from '../../enums/ProductStatusEnum';
import Button from 'react-bootstrap/esm/Button';
import { ProductDataType } from '@/type/ProductDataType';
import { useGetProductByCode } from '@/api/product';
import errorHandler from '@/utils/error';
import useBoundStore from '@/store/store';
import { useDeleteCartByCode, useUpdateCartByCode } from '@/api/cart';

const CartOrderDetail = ({ code, quantity }: CartOrderDetailProps) => {
  const [validated, setValidated] = useState(false);
  const [product, setProduct] = useState<ProductDataType>({
    productId: null,
    productCode: '',
    productName: '',
    productPrice: null,
    productPeriod: null,
    productDescription: '',
    productImage: '',
    productStatus: null,
    productCategoryCode: '',
    createTime: '',
    updateTime: '',
  });
  const [showGetProductToast, setShowGetProductToast] = useState(false);
  const [errorGetProduct, setErrorGetProduct] = useState<any>({});
  const [showUpdateCartOrderDetailToast, setShowUpdateCartOrderDetailToast] =
    useState(false);
  const [errorUpdateCartOrderDetail, setErrorUpdateCartOrderDetail] =
    useState<any>({});

  const cart = useBoundStore.use.cartDetails?.();
  const userToken = useBoundStore.use.userToken?.();
  const setCartOrderDetails = useBoundStore.use.setCartOrderDetails();

  const {
    data: productData,
    error: productError,
    isError: productIsError,
    isSuccess: productIsSuccess,
  } = useGetProductByCode(code);

  useEffect(() => {
    if (productIsSuccess) {
      setProduct(productData.data);
      setErrorGetProduct({});
      setShowGetProductToast(true);
    }

    if (productIsError) {
      errorHandler({
        error: productError,
        axiosErrorHandlerFn: err => {
          setErrorGetProduct(err);
          setShowGetProductToast(true);
        },
        generalErrorHandlerFn: err => {
          setErrorGetProduct(err);
          setShowGetProductToast(true);
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productData, productError, productIsError, productIsSuccess]);

  const mutationOptions = {
    successSideEffect: () => {
      setErrorUpdateCartOrderDetail({});
      setShowUpdateCartOrderDetailToast(true);
    },
    onError: (error: Error) => {
      errorHandler({
        error,
        axiosErrorHandlerFn: err => {
          setErrorUpdateCartOrderDetail(err);
          setShowUpdateCartOrderDetailToast(true);
        },
        generalErrorHandlerFn: err => {
          setErrorUpdateCartOrderDetail(err);
          setShowUpdateCartOrderDetailToast(true);
        },
      });
    },
  };

  const deleteCart = useDeleteCartByCode(mutationOptions);
  const updateCart = useUpdateCartByCode(mutationOptions);

  const handleQuantityLocalChange = (quantity: number) => {
    const oldCart = cart;
    const newCart = [];
    for (const orderDetail of oldCart) {
      if (orderDetail.productCode !== code) {
        newCart.push({
          orderDetailId: orderDetail.orderDetailId,
          productCode: orderDetail.productCode,
          productPrice: orderDetail.productPrice,
          quantity: orderDetail.quantity,
        });
      }
      if (orderDetail.productCode === code && Number(quantity) > 0) {
        newCart.push({
          orderDetailId: orderDetail.orderDetailId,
          productCode: orderDetail.productCode,
          productPrice: orderDetail.productPrice,
          quantity: Number(quantity),
        });
      }
    }
    setCartOrderDetails(newCart);
  };

  const handleQuantityServerChange = async (quantity: number) => {
    if (!userToken) {
      return;
    }

    if (quantity > 0) {
      await updateCart.mutate({ code, quantity });
    }

    if (quantity === 0) {
      await deleteCart.mutate({ code });
    }
  };

  const handleQuantityChange = async (quantity: any) => {
    await handleQuantityServerChange(quantity);
    handleQuantityLocalChange(quantity);
  };

  const handleSubmitCartOrderDetail = async (e: any) => {
    const form = e.currentTarget;

    setValidated(true);
    e.preventDefault();
    if (form.checkValidity()) {
      await handleQuantityChange(e.target[0].value);
    }
  };

  const handleQuantityMinus = async () => {
    if (Number(quantity) > 0) {
      const newQuantity = Number(quantity) - Number(1);
      await handleQuantityChange(newQuantity);
    } else {
      await handleQuantityChange(quantity);
    }
  };

  const handleQuantityPlus = async () => {
    const newQuantity = Number(quantity) + Number(1);
    await handleQuantityChange(newQuantity);
  };

  return (
    <>
      <div className="col">
        <div className="card w-100">
          <div className="row g-0">
            <div className="col col-5">
              <img
                src={
                  product.productImage
                    ? product.productImage
                    : 'https://firebasestorage.googleapis.com/v0/b/ai-quant-assistant.appspot.com/o/product_image_notfound.jpg?alt=media&token=9b66da8d-37b7-4f30-bbc2-1338d7e2f52c'
                }
                className="card-img-top tw-overflow-hidden"
                alt="Product"
                height={250}
              />
            </div>
            <div className="col col-7">
              <div className="card-body d-flex flex-column justify-content-between">
                <div className="card-description">
                  <h5 className="card-title">{product.productName}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">{code}</h6>
                  <p className="card-text">{product.productDescription}</p>
                  <p className="card-text">
                    {
                      ProductStatusEnum[
                        (product.productStatus as keyof typeof ProductStatusEnum) ||
                          0
                      ]
                    }
                  </p>
                  <p className="card-text">${product.productPrice}</p>
                  <p className="card-text">
                    {product.productPeriod}{' '}
                    {product.productPeriod && product.productPeriod < 2
                      ? 'month'
                      : 'months'}
                  </p>
                </div>
                <div className="card-form container">
                  <div className="row mt-3">
                    <div className="col col-2 d-flex justify-content-center align-items-center">
                      <Button
                        variant="outline-primary"
                        onClick={handleQuantityMinus}>
                        <FaMinus />
                      </Button>
                    </div>
                    <div className="col col-8 d-flex justify-content-center align-items-center">
                      <Form
                        className="cart-order-detail-form w-100"
                        noValidate
                        validated={validated}
                        onSubmit={handleSubmitCartOrderDetail}>
                        <FloatingLabel
                          controlId="floatingInput"
                          label="Quantity">
                          <Form.Control
                            type="number"
                            name="quantity"
                            value={Number(quantity)}
                            onChange={handleQuantityChange}
                            onWheel={e => (e.target as HTMLElement).blur()}
                            placeholder="Quantity"
                            min={0}
                            required
                          />
                        </FloatingLabel>
                      </Form>
                    </div>
                    <div className="col col-2 d-flex justify-content-center align-items-center">
                      <Button
                        variant="outline-primary"
                        onClick={handleQuantityPlus}>
                        <FaPlus />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <>
        <ToastContainer className="position-fixed p-3 top-0 end-0">
          {Object.keys(errorGetProduct).length > 0 && (
            <Toast
              onClose={() => setShowGetProductToast(false)}
              show={showGetProductToast}
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
              <Toast.Body>{errorGetProduct.message}</Toast.Body>
            </Toast>
          )}
        </ToastContainer>
        <ToastContainer className="position-fixed p-3 top-0 end-0">
          {Object.keys(errorUpdateCartOrderDetail).length > 0 && (
            <Toast
              onClose={() => setShowGetProductToast(false)}
              show={showUpdateCartOrderDetailToast}
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
              <Toast.Body>{errorUpdateCartOrderDetail.message}</Toast.Body>
            </Toast>
          )}
        </ToastContainer>
      </>
    </>
  );
};

type CartOrderDetailProps = {
  code: string;
  quantity: number;
};

export default CartOrderDetail;
