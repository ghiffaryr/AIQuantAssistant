/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import Button from 'react-bootstrap/esm/Button';
import { LinkContainer } from 'react-router-bootstrap';
import Form from 'react-bootstrap/Form';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/esm/ToastContainer';
import FloatingLabel from 'react-bootstrap/esm/FloatingLabel';
import Plot from 'react-plotly.js';
import UpdateCategoryModal from './UpdateCategoryModal';
import { useCategoryPredict, useCategorySellerDelete } from '@/api/category';
import errorHandler from '@/utils/error';
import { numberToPercentage } from '@/utils/number';
import { CategoryDetailType } from '@/type/CategoryType';
import useBoundStore from '@/store/store';

const Category = ({
  id,
  code,
  name,
  description,
  image,
  createTime,
  updateTime,
  categories,
  setCategories,
}: CategoryProps) => {
  const [inputs, setInputs] = useState<{ [key: string]: any }>({
    forecastingHorizon: 1,
    stockCode: '',
    trainingWindow: 3,
  });
  const [validated, setValidated] = useState(false);
  const [showPredictToast, setShowPredictToast] = useState(false);
  const [errorPredict, setErrorPredict] = useState({});
  const [forecastPrediction, setForecastPrediction] = useState<any>({});
  const [textPrediction, setTextPrediction] = useState('');
  const [showUpdateCategoryModal, setShowUpdateCategoryModal] = useState(false);
  const [showDeleteCategoryToast, setShowDeleteCategoryToast] = useState(false);
  const [errorDeleteCategory, setErrorDeleteCategory] = useState({});

  const userRole = useBoundStore.use.userRole?.();

  const categorySellerDelete = useCategorySellerDelete({
    successSideEffect: () => {
      setErrorDeleteCategory({});
      setShowDeleteCategoryToast(true);
    },
    onError: error => {
      errorHandler({
        error,
        axiosErrorHandlerFn: err => {
          setErrorDeleteCategory(err);
          setShowDeleteCategoryToast(true);
        },
        generalErrorHandlerFn: err => {
          setErrorDeleteCategory({ message: err.message });
          setShowDeleteCategoryToast(true);
        },
      });
    },
  });

  const categoryTextPredict = useCategoryPredict({
    onSuccess: data => {
      if (code === 'text_summary') {
        setTextPrediction(data.data);
      } else if (code === 'text_sentiment' || code === 'text_topic') {
        setTextPrediction(
          `${numberToPercentage(data.data[0].score).toString()} ${data.data[0].label}`,
        );
      }

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

  const categoryForecastPredict = useCategoryPredict({
    onSuccess: data => {
      setForecastPrediction(data.data);
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

  const handleDelete = async () => {
    categorySellerDelete.mutate({ code: code! });
  };

  function handleChange(e: any) {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  }

  const handleForecastPredict = async (
    stockCode: string,
    trainingWindow: number,
    forecastingHorizon: number,
  ) => {
    categoryForecastPredict.mutate({
      code: code!,
      val: {
        forecastingHorizon,
        stockCode,
        trainingWindow,
      },
    });
  };

  const handleSubmitForecastPredict = (e: any) => {
    const form = e.currentTarget;

    setValidated(true);
    e.preventDefault();
    if (form.checkValidity()) {
      handleForecastPredict(
        e.target[0].value,
        e.target[1].value,
        e.target[2].value,
      );
    }
  };

  const handleTextPredict = (input: any) => {
    categoryTextPredict.mutate({ code: code!, val: { input } });
  };

  const handleSubmitTextPredict = (e: any) => {
    const form = e.currentTarget;

    setValidated(true);
    e.preventDefault();
    if (form.checkValidity()) {
      handleTextPredict(e.target[0].value);
    }
  };

  return (
    <>
      <div className="col">
        {userRole === 'ROLE_EMPLOYEE' || userRole === 'ROLE_MANAGER' ? (
          <div className="card">
            <div className="row g-0">
              <div className="col col-4">
                <img
                  src={
                    image
                      ? image
                      : 'https://firebasestorage.googleapis.com/v0/b/ai-quant-assistant.appspot.com/o/product_image_notfound.jpg?alt=media&token=9b66da8d-37b7-4f30-bbc2-1338d7e2f52c'
                  }
                  className="card-img-top tw-overflow-hidden"
                  alt="Category"
                  height={250}
                />
                {userRole == 'ROLE_EMPLOYEE' && (
                  <div className="text-center mt-3 mb-3">
                    <Button
                      variant="outline-primary"
                      onClick={() => setShowUpdateCategoryModal(true)}
                    >
                      Update
                    </Button>
                  </div>
                )}
                {userRole == 'ROLE_MANAGER' && (
                  <div className="text-center mt-3 mb-3">
                    <div className="d-flex justify-content-evenly">
                      <Button
                        variant="outline-primary"
                        onClick={() => setShowUpdateCategoryModal(true)}
                      >
                        Update
                      </Button>
                      <Button variant="outline-danger" onClick={handleDelete}>
                        Delete
                      </Button>
                    </div>
                  </div>
                )}
                <div className="card-footer">
                  <small className="text-muted">
                    Updated at{' '}
                    {updateTime
                      ? new Date(updateTime).toString()
                      : new Date(0).toString()}
                  </small>
                </div>
              </div>
              {code!.startsWith('forecast') && (
                <div className="col col-8">
                  <div className="card-body d-flex flex-column justify-content-between">
                    <div className="card-description">
                      <h5 className="card-title">{name}</h5>
                      <h6 className="card-subtitle mb-2 text-muted">{code}</h6>
                      <p className="card-text">{description}</p>
                    </div>
                    <div className="card-form w-100 align-self-center mt-3">
                      <Form
                        className="cart-form row row-cols-1 row-cols-lg-3 g-4 justify-content-center"
                        noValidate
                        validated={validated}
                        onSubmit={handleSubmitForecastPredict}
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
                              Stock code cannot be blank.
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
                        {categoryForecastPredict.isPending ||
                        categoryTextPredict.isPending ? (
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
              )}
              {code!.startsWith('text') && (
                <div className="col col-8">
                  <div className="card-body d-flex flex-column justify-content-between">
                    <div className="card-description">
                      <h5 className="card-title">{name}</h5>
                      <h6 className="card-subtitle mb-2 text-muted">{code}</h6>
                      <p className="card-text">{description}</p>
                    </div>
                    <div className="card-form w-100 align-self-center mt-3">
                      <Form
                        className="cart-form row row-cols-1 row-cols-lg-1 g-4 justify-content-center"
                        noValidate
                        validated={validated}
                        onSubmit={handleSubmitTextPredict}
                      >
                        <div className="col">
                          <FloatingLabel
                            controlId="floatingInput"
                            label="Input"
                            className="mb-3"
                          >
                            <Form.Control
                              as="textarea"
                              name="input"
                              value={inputs.input}
                              onChange={handleChange}
                              onWheel={e => (e.target as HTMLElement).blur()}
                              placeholder="Input"
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                              Input cannot be blank.
                            </Form.Control.Feedback>
                          </FloatingLabel>
                        </div>
                        {categoryForecastPredict.isPending ||
                        categoryTextPredict.isPending ? (
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
                        {textPrediction && (
                          <div className="container">
                            <h3 className="mt-4">Summary</h3>
                            <p className="text-black">{textPrediction}</p>
                          </div>
                        )}
                      </Form>
                    </div>
                  </div>
                </div>
              )}
              <div className="col col-12">
                {Object.keys(forecastPrediction).length > 0 && (
                  <Plot
                    className="w-100"
                    data={forecastPrediction.data}
                    layout={forecastPrediction.layout}
                    config={{ responsive: true }}
                  />
                )}
              </div>
            </div>
            <>
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
              <ToastContainer className="position-fixed p-3 top-0 end-0">
                {Object.keys(errorDeleteCategory).length > 0 ? (
                  <Toast
                    onClose={() => setShowDeleteCategoryToast(false)}
                    show={showDeleteCategoryToast}
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
                      {(errorDeleteCategory as any).message}
                    </Toast.Body>
                  </Toast>
                ) : (
                  <Toast
                    onClose={() => setShowDeleteCategoryToast(false)}
                    show={showDeleteCategoryToast}
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
                    <Toast.Body>Delete product success!</Toast.Body>
                  </Toast>
                )}
              </ToastContainer>
            </>
            <>
              <UpdateCategoryModal
                id={id}
                code={code}
                name={name}
                description={description}
                image={image}
                createTime={createTime}
                updateTime={updateTime}
                categories={categories}
                setCategories={setCategories}
                show={showUpdateCategoryModal}
                onHide={() => setShowUpdateCategoryModal(false)}
              />
            </>
          </div>
        ) : (
          <div className="card h-100">
            <img
              src={
                image
                  ? image
                  : 'https://firebasestorage.googleapis.com/v0/b/ai-quant-assistant.appspot.com/o/product_image_notfound.jpg?alt=media&token=9b66da8d-37b7-4f30-bbc2-1338d7e2f52c'
              }
              className="card-img-top tw-overflow-hidden"
              alt="Category"
              height={250}
            />
            <div className="card-body d-flex flex-column justify-content-between">
              <div className="card-description">
                <h5 className="card-title">{name}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{code}</h6>
                <p className="card-text">{description}</p>
              </div>
              <div className="card-form align-self-center mt-3">
                <LinkContainer to={'/category/' + code}>
                  <Button variant="outline-primary">View Products</Button>
                </LinkContainer>
              </div>
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
        )}
      </div>
    </>
  );
};

type CategoryProps = {
  id?: number;
  code?: string;
  name?: string;
  description?: string;
  image?: string;
  createTime?: string;
  updateTime?: string;
  categories?: CategoryDetailType[];
  setCategories?: React.Dispatch<React.SetStateAction<CategoryDetailType[]>>;
};

export default Category;
