import React, { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import { LinkContainer } from "react-router-bootstrap";
import Form from "react-bootstrap/Form";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/esm/ToastContainer";
import { API } from "../../env/Constants";
import FloatingLabel from "react-bootstrap/esm/FloatingLabel";
import Plot from "react-plotly.js";
import axios from "axios";
import UpdateCategoryModal from "./UpdateCategoryModal";

export default function Category({
  id,
  code,
  name,
  description,
  image,
  createTime,
  updateTime,
  categories,
  setCategories,
}) {
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
  const [showUpdateCategoryModal, setShowUpdateCategoryModal] = useState(false);
  const [showDeleteCategoryToast, setShowDeleteCategoryToast] = useState(false);
  const [errorDeleteCategory, setErrorDeleteCategory] = useState({});

  function handleChange(e) {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  }

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
        `${API}/category/${code}/predict`,
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
        `${API}/category/${code}/predict`,
        {
          input: input,
        }
      );
      if (code === "text_summary") {
        setTextPrediction(data);
      } else if (code === "text_sentiment" || code === "text_topic") {
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

  const handleDelete = async () => {
    axios.defaults.headers.common = {
      Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      "Access-Control-Allow-Origin": "*",
    };
    try {
      let { status, data } = await axios.delete(
        `${API}/seller/category/${code}/delete`
      );
      setCategories((categories) =>
        categories.filter((category) => category.productCategoryCode != code)
      );
      setErrorDeleteCategory({});
      setShowDeleteCategoryToast(true);
    } catch (error) {
      for (let errorObject of error.response.data.errors) {
        setErrorDeleteCategory(errorObject);
        setShowDeleteCategoryToast(true);
      }
    }
  };

  return (
    <>
      <div className="col">
        {localStorage.getItem("userRole") === "ROLE_EMPLOYEE" ||
        localStorage.getItem("userRole") === "ROLE_MANAGER" ? (
          <div className="card">
            <div className="row g-0">
              <div className="col col-4">
                <img
                  src={
                    image
                      ? image
                      : "https://firebasestorage.googleapis.com/v0/b/ai-quant-assistant.appspot.com/o/product_image_notfound.jpg?alt=media&token=9b66da8d-37b7-4f30-bbc2-1338d7e2f52c"
                  }
                  className="card-img-top"
                  alt="Category Image"
                  height={250}
                  overflow="hidden"
                />
                {localStorage.getItem("userRole") == "ROLE_EMPLOYEE" && (
                  <div className="text-center mt-3 mb-3">
                    <Button
                      variant="outline-primary"
                      onClick={() => setShowUpdateCategoryModal(true)}
                    >
                      Update
                    </Button>
                  </div>
                )}
                {localStorage.getItem("userRole") == "ROLE_MANAGER" && (
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
                    Updated at {new Date(updateTime).toString()}
                  </small>
                </div>
              </div>
              {code.startsWith("forecast") && (
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
              {code.startsWith("text") && (
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
                    <Toast.Body>{errorDeleteCategory.message}</Toast.Body>
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
                  : "https://firebasestorage.googleapis.com/v0/b/ai-quant-assistant.appspot.com/o/product_image_notfound.jpg?alt=media&token=9b66da8d-37b7-4f30-bbc2-1338d7e2f52c"
              }
              className="card-img-top"
              alt="Category Image"
              height={250}
              overflow="hidden"
            />
            <div className="card-body d-flex flex-column justify-content-between">
              <div className="card-description">
                <h5 className="card-title">{name}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{code}</h6>
                <p className="card-text">{description}</p>
              </div>
              <div className="card-form align-self-center mt-3">
                <LinkContainer to={"/category/" + code}>
                  <Button variant="outline-primary">View Products</Button>
                </LinkContainer>
              </div>
            </div>
            <div className="card-footer">
              <small className="text-muted">
                Updated at {new Date(updateTime).toString()}
              </small>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
