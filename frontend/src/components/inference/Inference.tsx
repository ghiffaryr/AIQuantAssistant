/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Form from 'react-bootstrap/Form';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/esm/ToastContainer';
import FloatingLabel from 'react-bootstrap/esm/FloatingLabel';
import Plot from 'react-plotly.js';
import {
  useCategoryPredict,
  useGetCategoryByProductCategoryCode,
} from '@/api/category';
import { CategoryDetailType } from '@/type/CategoryType';
import errorHandler from '@/utils/error';

const Inference = ({ productCategoryCode, expTime }: InferenceProps) => {
  const [productCategory, setProductCategory] = useState<CategoryDetailType>({
    productCategoryId: undefined,
    productCategoryCode: '',
    productCategoryName: '',
    productCategoryDescription: '',
    productCategoryImage: '',
    createTime: '',
    updateTime: '',
  });
  const [showGetProductCategoryToast, setShowGetProductCategoryToast] =
    useState(false);
  const [errorGetProductCategory, setErrorGetProductCategory] = useState({});
  const [inputs, setInputs] = useState({
    forecastingHorizon: 1,
    stockCode: '',
    trainingWindow: 3,
  });
  const [validated, setValidated] = useState(false);
  const [showPredictToast, setShowPredictToast] = useState(false);
  const [errorPredict, setErrorPredict] = useState({});
  const [prediction, setPrediction] = useState<any>({});

  function handleChange(e: any) {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  }

  const {
    data: categoryData,
    error: categoryError,
    isSuccess: categoryIsSuccess,
    isError: categoryIsError,
  } = useGetCategoryByProductCategoryCode(productCategoryCode!, {
    enabled: true,
  });

  useEffect(() => {
    if (categoryIsSuccess) {
      setProductCategory(categoryData.data);
      setErrorGetProductCategory({});
      setShowGetProductCategoryToast(true);
    }

    if (categoryIsError) {
      errorHandler({
        error: categoryError,
        axiosErrorHandlerFn: err => {
          setErrorGetProductCategory(err);
          setShowGetProductCategoryToast(true);
        },
        generalErrorHandlerFn: err => {
          setErrorGetProductCategory({ message: err.message });
          setShowGetProductCategoryToast(true);
        },
      });
    }
  }, [categoryData, categoryError, categoryIsSuccess, categoryIsError]);

  const categoryPredict = useCategoryPredict({
    onSuccess: data => {
      setPrediction(data.data);
      setErrorPredict({});
      setShowPredictToast(true);
    },
    onError: error => {
      errorHandler({
        error,
        axiosErrorHandlerFn: err => {
          setErrorPredict(err);
          setShowPredictToast(true);
        },
        generalErrorHandlerFn: err => {
          setErrorPredict({ message: err.message });
          setShowPredictToast(true);
        },
      });
    },
  });

  const handlePredict = (
    stockCode: string,
    trainingWindow: number,
    forecastingHorizon: number,
  ) => {
    categoryPredict.mutate({
      code: productCategoryCode!,
      val: { stockCode, trainingWindow, forecastingHorizon },
    });
  };

  const handleSubmitPredict = (e: any) => {
    const form = e.currentTarget;

    setValidated(true);
    e.preventDefault();
    if (form.checkValidity()) {
      handlePredict(e.target[0].value, e.target[1].value, e.target[2].value);
    }
  };

  return (
    <>
      <div className="col">
        <div className="card">
          <div className="row g-0">
            <div className="col col-4">
              <img
                src={
                  productCategory.productCategoryImage
                    ? productCategory.productCategoryImage
                    : 'https://firebasestorage.googleapis.com/v0/b/ai-quant-assistant.appspot.com/o/product_image_notfound.jpg?alt=media&token=9b66da8d-37b7-4f30-bbc2-1338d7e2f52c'
                }
                className="card-img-top tw-overflow-hidden"
                alt="Category"
                height={250}
              />
              <div className="card-footer">
                <small className="text-muted">
                  Expired at {new Date(expTime!).toString()}
                </small>
              </div>
            </div>
            <div className="col col-8">
              <div className="card-body d-flex flex-column justify-content-between">
                <div className="card-description">
                  <h5 className="card-title">
                    {productCategory.productCategoryName}
                  </h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                    {productCategory.productCategoryCode}
                  </h6>
                  <p className="card-text">
                    {productCategory.productCategoryDescription}
                  </p>
                </div>
                <div className="card-form w-100 align-self-center mt-3">
                  <Form
                    className="cart-form row row-cols-1 row-cols-lg-3 g-4 justify-content-center"
                    noValidate
                    validated={validated}
                    onSubmit={handleSubmitPredict}
                  >
                    <div className="col">
                      <FloatingLabel
                        controlId="floatingInput"
                        label="Stock Code"
                        className="mb-3"
                      >
                        <Form.Control
                          type="text"
                          name="stockCode"
                          value={inputs.stockCode}
                          onChange={handleChange}
                          onWheel={e => (e.target as HTMLElement).blur()}
                          placeholder="Stock Code"
                          pattern="^(?!\s*$).+"
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          category/sentiment/predict cannot be blank.
                        </Form.Control.Feedback>
                      </FloatingLabel>
                    </div>

                    <div className="col">
                      <FloatingLabel
                        controlId="floatingInput"
                        label="Training Window (month)"
                        className="mb-3"
                      >
                        <Form.Control
                          type="number"
                          name="trainingWindow"
                          value={inputs.trainingWindow}
                          onChange={handleChange}
                          onWheel={e => (e.target as HTMLElement).blur()}
                          placeholder="Training Window (month)"
                          min={1}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Minimum training window is 1.
                        </Form.Control.Feedback>
                      </FloatingLabel>
                    </div>
                    <div className="col">
                      <FloatingLabel
                        controlId="floatingInput"
                        label="Forecasting Horizon (month)"
                        className="mb-3"
                      >
                        <Form.Control
                          type="number"
                          name="forecastingHorizon"
                          value={inputs.forecastingHorizon}
                          onChange={handleChange}
                          onWheel={e => (e.target as HTMLElement).blur()}
                          placeholder="Forecasting Horizon (month)"
                          min={1}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Minimum forecasting horizon is 1.
                        </Form.Control.Feedback>
                      </FloatingLabel>
                    </div>
                    {categoryPredict.isPending ? (
                      <div className="col text-center">
                        <div
                          className="spinner-border text-primary"
                          role="status"
                          style={{
                            width: '2rem',
                            height: '2rem',
                            borderWidth: '0.25rem',
                          }}
                        />
                      </div>
                    ) : (
                      <div className="col text-center ">
                        <Button
                          className="w-100"
                          type="submit"
                          variant="outline-primary"
                        >
                          Predict
                        </Button>
                      </div>
                    )}
                  </Form>
                </div>
              </div>
            </div>
            <div className="col col-12">
              {Object.keys(prediction).length > 0 && (
                <Plot
                  className="w-100"
                  data={prediction.data}
                  layout={prediction.layout}
                  config={{ responsive: true }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <>
        <ToastContainer className="position-fixed p-3 top-0 end-0">
          {Object.keys(errorGetProductCategory).length > 0 && (
            <Toast
              onClose={() => setShowGetProductCategoryToast(false)}
              show={showGetProductCategoryToast}
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
              <Toast.Body>
                {(errorGetProductCategory as any).message}
              </Toast.Body>
            </Toast>
          )}
        </ToastContainer>
        <ToastContainer className="position-fixed p-3 top-0 end-0">
          {Object.keys(errorPredict).length > 0 ? (
            <Toast
              onClose={() => setShowPredictToast(false)}
              show={showPredictToast}
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
              <Toast.Body>{(errorPredict as any).message}</Toast.Body>
            </Toast>
          ) : (
            <Toast
              onClose={() => setShowPredictToast(false)}
              show={showPredictToast}
              delay={3000}
              autohide
            >
              <Toast.Header className="bg-success">
                <img
                  src="holder.js/20x20?text=%20"
                  className="rounded me-2"
                  alt=""
                />
                <strong className="me-auto text-light">Success</strong>
              </Toast.Header>
              <Toast.Body>Predict success!</Toast.Body>
            </Toast>
          )}
        </ToastContainer>
      </>
    </>
  );
};

type InferenceProps = {
  productCategoryCode?: string;
  expTime?: string;
};

export default Inference;
