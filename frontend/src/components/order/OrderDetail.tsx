/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import ToastContainer from 'react-bootstrap/esm/ToastContainer';
import Toast from 'react-bootstrap/Toast';
import ProductStatusEnum from '@/enums/ProductStatusEnum';
import { useGetProductByCode } from '@/api/product';
import { ProductDataType } from '@/type/ProductDataType';
import errorHandler from '@/utils/error';

const OrderDetail = ({ code }: OrderDetailProps) => {
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
  const [errorGetProduct, setErrorGetProduct] = useState({});

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
      return;
    }

    if (productIsError) {
      errorHandler({
        error: productError,
        axiosErrorHandlerFn: err => {
          setErrorGetProduct(err);
          setShowGetProductToast(true);
        },
        generalErrorHandlerFn: err => {
          setErrorGetProduct({ message: err.message });
          setShowGetProductToast(true);
        },
      });
    }
  }, [productData, productError, productIsError, productIsSuccess]);

  return (
    <>
      <div className="col">
        <div className="card h-100">
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
              <Toast.Body>{(errorGetProduct as any).message}</Toast.Body>
            </Toast>
          )}
        </ToastContainer>
      </>
    </>
  );
};

type OrderDetailProps = {
  code: string;
};

export default OrderDetail;
