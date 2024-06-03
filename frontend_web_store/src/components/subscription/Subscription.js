import axios from "axios";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/Form";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/esm/ToastContainer";
import { API } from "../../env/Constants";
import FloatingLabel from "react-bootstrap/esm/FloatingLabel";
import Plot from "react-plotly.js";

export default function Subscription({
  id,
  productCategoryCode,
  userEmail,
  expTime,
  setSubscriptions,
}) {
  const [productCategory, setProductCategory] = useState({
    productCategoryId: null,
    productCategoryCode: "",
    productCategoryName: "",
    productCategoryDescription: "",
    productCategoryImage: "",
    createTime: "",
    updateTime: "",
  });
  const [showGetProductCategoryToast, setShowGetProductCategoryToast] =
    useState(false);
  const [errorGetProductCategory, setErrorGetProductCategory] = useState({});
  const [inputs, setInputs] = useState({
    forecastingHorizon: 1,
    stockCode: "",
    trainingWindow: 3,
  });
  const [validated, setValidated] = useState(false);
  const [showPredictToast, setShowPredictToast] = useState(false);
  const [errorPredict, setErrorPredict] = useState({});
  const [forecastPrediction, setForecastPrediction] = useState({});
  const [textPrediction, setTextPrediction] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  }

  const getProductCategory = async (productCategoryCode) => {
    try {
      axios.defaults.headers.common = {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        "Access-Control-Allow-Origin": "*",
      };
      let { status, data } = await axios.get(
        `${API}/category/${productCategoryCode}`
      );
      setProductCategory(data);
      setErrorGetProductCategory({});
      setShowGetProductCategoryToast(true);
    } catch (error) {
      for (let errorObject of error.response.data.errors) {
        setErrorGetProductCategory(errorObject);
        setShowGetProductCategoryToast(true);
      }
    }
  };

  useEffect(() => {
    getProductCategory(productCategoryCode);
  }, [productCategoryCode]);

  const handleForecastPredict = async (
    stockCode,
    trainingWindow,
    forecastingHorizon
  ) => {
    setLoading(true);
    try {
      axios.defaults.headers.common = {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        "Access-Control-Allow-Origin": "*",
      };
      let { status, data } = await axios.post(
        `${API}/category/${productCategoryCode}/predict`,
        {
          stockCode: stockCode,
          trainingWindow: trainingWindow,
          forecastingHorizon: forecastingHorizon,
        }
      );
      setForecastPrediction(data);
      setErrorPredict({});
      setShowPredictToast(true);
    } catch (error) {
      for (let errorObject of error.response.data.errors) {
        setErrorPredict(errorObject);
        setShowPredictToast(true);
      }
    }
    setLoading(false);
  };

  const handleSubmitForecastPredict = async (e) => {
    const form = e.currentTarget;

    setValidated(true);
    e.preventDefault();
    if (form.checkValidity()) {
      await handleForecastPredict(
        e.target[0].value,
        e.target[1].value,
        e.target[2].value
      );
    }
  };

  function numberToPercentage(number) {
    if (typeof number !== "number") {
      throw new Error("Input must be a number");
    }

    const percentage = (number * 100).toFixed(2);
    return `${percentage}%`;
  }

  const handleTextPredict = async (input) => {
    setLoading(true);
    try {
      axios.defaults.headers.common = {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        "Access-Control-Allow-Origin": "*",
      };
      let { status, data } = await axios.post(
        `${API}/category/${productCategoryCode}/predict`,
        {
          input: input,
        }
      );
      if (productCategoryCode === "text_summary") {
        setTextPrediction(data);
      } else if (
        productCategoryCode === "text_sentiment" ||
        productCategoryCode === "text_topic"
      ) {
        setTextPrediction(
          `${numberToPercentage(Number(data[0].score)).toString()} ${
            data[0].label
          }`
        );
      }

      setErrorPredict({});
      setShowPredictToast(true);
    } catch (error) {
      for (let errorObject of error.response.data.errors) {
        setErrorPredict(errorObject);
        setShowPredictToast(true);
      }
    }
    setLoading(false);
  };

  const handleSubmitTextPredict = async (e) => {
    const form = e.currentTarget;

    setValidated(true);
    e.preventDefault();
    if (form.checkValidity()) {
      await handleTextPredict(e.target[0].value);
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
                    : "https://firebasestorage.googleapis.com/v0/b/ai-quant-assistant.appspot.com/o/product_image_notfound.jpg?alt=media&token=9b66da8d-37b7-4f30-bbc2-1338d7e2f52c"
                }
                className="card-img-top"
                alt="Category Image"
                height={250}
                overflow="hidden"
              />
              <div className="card-footer">
                <small className="text-muted">
                  Expired at {new Date(expTime).toString()}
                </small>
              </div>
            </div>
            {productCategory.productCategoryCode.startsWith("forecast") && (
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
                            onWheel={(e) => e.target.blur()}
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
                            onWheel={(e) => e.target.blur()}
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
                            onWheel={(e) => e.target.blur()}
                            placeholder="Forecasting Horizon (month)"
                            min={1}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Minimum forecasting horizon is 1.
                          </Form.Control.Feedback>
                        </FloatingLabel>
                      </div>
                      {loading ? (
                        <div className="col text-center">
                          <div
                            className="spinner-border text-primary"
                            role="status"
                            style={{
                              width: "2rem",
                              height: "2rem",
                              borderWidth: "0.25rem",
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
            {productCategory.productCategoryCode.startsWith("text") && (
              <div className="col col-8">
                <div className="card-body d-flex flex-column justify-content-between">
                  <div className="card-description">
                    <h5 className="card-title">
                      {productCategory.productCategoryName}
                    </h5>
                    <h6 className="card-subtitle mb-2 text-muted">
                      {productCategoryCode}
                    </h6>
                    <p className="card-text">
                      {productCategory.productCategoryDescription}
                    </p>
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
                            onWheel={(e) => e.target.blur()}
                            placeholder="Input"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Input cannot be blank.
                          </Form.Control.Feedback>
                        </FloatingLabel>
                      </div>
                      {loading ? (
                        <div className="col text-center">
                          <div
                            className="spinner-border text-primary"
                            role="status"
                            style={{
                              width: "2rem",
                              height: "2rem",
                              borderWidth: "0.25rem",
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
              <Toast.Body>{errorGetProductCategory.message}</Toast.Body>
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
              <Toast.Body>{errorPredict.message}</Toast.Body>
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
}
