/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Form from 'react-bootstrap/Form';
import ToastContainer from 'react-bootstrap/esm/ToastContainer';
import Toast from 'react-bootstrap/Toast';
import ProductStatusEnum, {
  EProductStatus,
} from '../../enums/ProductStatusEnum';
import FloatingLabel from 'react-bootstrap/esm/FloatingLabel';
import UpdateProductModal from './UpdateProductModal';
import { useProductSellerDelete } from '@/api/product';
import { ProductDataType } from '@/type/ProductDataType';
import errorHandler from '@/utils/error';
import useBoundStore from '@/store/store';
import { useAddCart, useUpdateCartByCode } from '@/api/cart';

export default function Product({
  categoryCode,
  code,
  name,
  price,
  period,
  description,
  image,
  status,
  updateTime,
  products,
  setProducts,
}: ProductProps) {
  const [inputs, setInputs] = useState({ quantity: 1 });
  const [validated, setValidated] = useState(false);
  const [showAddToCartToast, setShowAddToCartToast] = useState(false);
  const [errorAddToCart, setErrorAddToCart] = useState({});
  const [showUpdateProductModal, setShowUpdateProductModal] = useState(false);
  const [showDeleteProductToast, setShowDeleteProductToast] = useState(false);
  const [errorDeleteProduct, setErrorDeleteProduct] = useState({});

  const cart = useBoundStore.use.cartDetails();
  const userToken = useBoundStore.use.userToken?.();
  const userRole = useBoundStore.use.userRole?.();
  const setCartOrderDetails = useBoundStore.use.setCartOrderDetails();

  const cartUpdate = useUpdateCartByCode({
    successSideEffect: () => {
      setErrorAddToCart({});
      setShowAddToCartToast(true);
    },
    onError: error => {
      errorHandler({
        error,
        axiosErrorHandlerFn: err => {
          setErrorAddToCart(err);
          setShowAddToCartToast(true);
        },
        generalErrorHandlerFn: err => {
          setErrorAddToCart({ message: err.message });
          setShowAddToCartToast(true);
        },
      });
    },
  });

  const addCart = useAddCart({
    successSideEffect: () => {
      setErrorAddToCart({});
      setShowAddToCartToast(true);
    },
    onError: error => {
      errorHandler({
        error,
        axiosErrorHandlerFn: err => {
          setErrorAddToCart(err);
          setShowAddToCartToast(true);
        },
        generalErrorHandlerFn: err => {
          setErrorAddToCart({ message: err.message });
          setShowAddToCartToast(true);
        },
      });
    },
  });

  function handleChange(e: any) {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  }

  const handleAddToCart = async (quantity: number) => {
    let newCart = cart;
    let isOrderDetailFound = false;
    if (cart) {
      let newQuantity = 0;
      newCart.some((val, i) => {
        if (val.productCode === code) {
          newCart[i].productPrice = price;
          newQuantity = Number(newCart[i].quantity) + Number(quantity);
          newCart[i].quantity = newQuantity;
          isOrderDetailFound = true;
        }

        return val.productCode === code;
      });
      if (isOrderDetailFound) {
        if (userToken) {
          cartUpdate.mutate({ code, quantity: newQuantity });
        }
      }
      if (!isOrderDetailFound) {
        newCart.push({
          orderDetailId: 0,
          productCode: code,
          productPrice: price,
          quantity: Number(quantity),
        });
      }
    } else {
      newCart = [
        {
          orderDetailId: 0,
          productCode: code,
          productPrice: price,
          quantity: Number(quantity),
        },
      ];
    }

    setCartOrderDetails(newCart);
    if (!cart || !isOrderDetailFound) {
      if (userToken) {
        addCart.mutate({ code, quantity });
      }
    }
  };

  const handleSubmitAddToCart = async (e: any) => {
    const form = e.currentTarget;

    setValidated(true);
    e.preventDefault();
    if (form.checkValidity()) {
      await handleAddToCart(e.target[0].value);
    }
  };

  const productSellerDelete = useProductSellerDelete({
    successSideEffect: () => {
      setProducts(products =>
        products.filter(product => product.productCode != code),
      );
      setErrorDeleteProduct({});
      setShowDeleteProductToast(true);
    },
    onError: err => {
      errorHandler({
        error: err,
        axiosErrorHandlerFn: err => {
          setErrorDeleteProduct(err);
          setShowDeleteProductToast(true);
        },
        generalErrorHandlerFn: err => {
          setErrorDeleteProduct(err);
          setShowDeleteProductToast(true);
        },
      });
    },
  });

  const handleDelete = async () => {
    productSellerDelete.mutate({ code });
  };

  return (
    <>
      <div className="col">
        <div className="card h-100">
          <img
            src={
              image
                ? image
                : 'https://firebasestorage.googleapis.com/v0/b/ai-quant-assistant.appspot.com/o/product_image_notfound.jpg?alt=media&token=9b66da8d-37b7-4f30-bbc2-1338d7e2f52c'
            }
            className="card-img-top tw-overflow-hidden"
            alt="Product"
            height={250}
          />
          <div className="card-body d-flex flex-column justify-content-between">
            <div className="card-description">
              <h5 className="card-title">{name}</h5>
              <h6 className="card-subtitle mb-2 text-muted">{code}</h6>
              <p className="card-text">{description}</p>
              <p className="card-text">{ProductStatusEnum[status]}</p>
              <p className="card-text">${price}</p>
              <p className="card-text">
                {period} {period || 0 < 2 ? 'month' : 'months'}
              </p>
            </div>
            {userRole != 'ROLE_EMPLOYEE' && userRole != 'ROLE_MANAGER' && (
              <div className="card-form w-100 align-self-center mt-3">
                <Form
                  className="cart-form"
                  noValidate
                  validated={validated}
                  onSubmit={handleSubmitAddToCart}>
                  <FloatingLabel
                    controlId="floatingInput"
                    label="Quantity"
                    className="mb-3">
                    <Form.Control
                      type="number"
                      name="quantity"
                      value={inputs.quantity}
                      onChange={handleChange}
                      onWheel={e => (e.target as HTMLElement).blur()}
                      placeholder="Quantity"
                      min={1}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Minimum quantity is 1.
                    </Form.Control.Feedback>
                  </FloatingLabel>
                  <div className="text-center">
                    <Button type="submit" variant="outline-primary">
                      Add to Cart
                    </Button>
                  </div>
                </Form>
              </div>
            )}
            {userRole == 'ROLE_EMPLOYEE' && (
              <div className="text-center mt-3">
                <Button
                  variant="outline-primary"
                  onClick={() => setShowUpdateProductModal(true)}>
                  Update
                </Button>
              </div>
            )}
            {userRole == 'ROLE_MANAGER' && (
              <div className="text-center mt-3">
                <div className="d-flex justify-content-evenly">
                  <Button
                    variant="outline-primary"
                    onClick={() => setShowUpdateProductModal(true)}>
                    Update
                  </Button>
                  <Button variant="outline-danger" onClick={handleDelete}>
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </div>
          <div className="card-footer">
            <small className="text-muted">
              Updated at{' '}
              {updateTime
                ? new Date(updateTime).toString()
                : new Date(0).toString()}
            </small>
          </div>
        </div>
      </div>
      <>
        <ToastContainer className="position-fixed p-3 top-0 end-0">
          {Object.keys(errorAddToCart).length > 0 ? (
            <Toast
              onClose={() => setShowAddToCartToast(false)}
              show={showAddToCartToast}
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
              <Toast.Body>{(errorAddToCart as any).message}</Toast.Body>
            </Toast>
          ) : (
            <Toast
              onClose={() => setShowAddToCartToast(false)}
              show={showAddToCartToast}
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
              <Toast.Body>Add to Cart success!</Toast.Body>
            </Toast>
          )}
        </ToastContainer>
        <ToastContainer className="position-fixed p-3 top-0 end-0">
          {Object.keys(errorDeleteProduct).length > 0 ? (
            <Toast
              onClose={() => setShowDeleteProductToast(false)}
              show={showDeleteProductToast}
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
              <Toast.Body>{(errorDeleteProduct as any).message}</Toast.Body>
            </Toast>
          ) : (
            <Toast
              onClose={() => setShowDeleteProductToast(false)}
              show={showDeleteProductToast}
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
              <Toast.Body>Delete product success!</Toast.Body>
            </Toast>
          )}
        </ToastContainer>
      </>
      <>
        <UpdateProductModal
          categoryCode={categoryCode}
          code={code}
          name={name}
          price={price}
          period={period}
          description={description}
          image={image}
          status={status}
          products={products}
          setProducts={setProducts}
          show={showUpdateProductModal}
          onHide={() => setShowUpdateProductModal(false)}
        />
      </>
    </>
  );
}

type ProductProps = {
  id?: number;
  categoryCode?: string;
  code: string;
  name?: string;
  price: number;
  period?: number;
  description?: string;
  image?: string;
  status: EProductStatus;
  createTime?: string;
  updateTime?: string;
  products: ProductDataType[];
  setProducts: React.Dispatch<React.SetStateAction<ProductDataType[]>>;
};
