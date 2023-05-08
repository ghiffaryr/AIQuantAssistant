import React, { useState } from "react";
import Container from "react-bootstrap/esm/Container";
import Form from "react-bootstrap/Form";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import InputGroup from "react-bootstrap/InputGroup";
import FooterComponent from "../../components/basic/FooterComponent";
import NavbarComponent from "../../components/basic/NavbarComponent";
import { FaUser, FaUnlock } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/esm/Button";
import "../../css/pages/main/LoginPage.css";
import { API } from "../../env/Constants";
import axios from "axios";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";

export default function LoginPage() {
  const [inputs, setInputs] = useState({ email: "", password: "" });
  const [showLoginToast, setShowLoginToast] = useState(false);
  const [errorLogin, setErrorLogin] = useState({});
  const [showMergeToServerCartToast, setShowMergeToServerCartToast] =
    useState(false);
  const [errorMergeToServerCart, setErrorMergeToServerCart] = useState({});
  const [showGetServerCartToast, setShowGetServerCartToast] = useState(false);
  const [errorGetServerCart, setErrorGetServerCart] = useState({});
  const [validated, setValidated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  function handleChange(e) {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  }

  const getProfile = async () => {
    try {
      let { status, data } = await axios.get(`${API}/profile`);

      // localStorage.setItem("userEmail", data.email);
      localStorage.setItem("userName", data.name);
      localStorage.setItem("userImage", data.image);
      localStorage.setItem("userPhone", data.phone);
      localStorage.setItem("userAddress", data.address);
      localStorage.setItem("userGender", data.gender);
      localStorage.setItem("userBirthdate", data.birthdate);
      localStorage.setItem("userRole", data.role);
      localStorage.setItem("userCreateTime", data.createTime);
      localStorage.setItem("userUpdateTime", data.updateTime);
      setErrorLogin({});
      setShowLoginToast(true);
    } catch (error) {
      // localStorage.removeItem("userEmail");
      localStorage.removeItem("userName");
      localStorage.removeItem("userImage");
      localStorage.removeItem("userPhone");
      localStorage.removeItem("userAddress");
      localStorage.removeItem("userGender");
      localStorage.removeItem("userBirthdate");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userCreateTime");
      localStorage.removeItem("userUpdateTime");
      for (let errorObject of error.response.data.errors) {
        setErrorLogin(errorObject);
        setShowLoginToast(true);
      }
    }
  };

  const mergeToServerCart = async () => {
    try {
      let { status, data } = await axios.post(
        `${API}/cart`,
        JSON.parse(localStorage.getItem("cart"))
      );
      setErrorMergeToServerCart({});
      setShowMergeToServerCartToast(true);
    } catch (error) {
      for (let errorObject of error.response.data.errors) {
        setErrorMergeToServerCart(errorObject);
        setShowMergeToServerCartToast(true);
      }
    }
  };

  const getServerCart = async () => {
    try {
      let { status, data } = await axios.get(`${API}/cart`);
      let cart = [];
      for (let orderDetail of data.orderDetails) {
        cart.push({
          orderDetailId: orderDetail.orderDetailId,
          productCode: orderDetail.productCode,
          productPrice: orderDetail.productPrice,
          quantity: orderDetail.quantity,
        });
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      setErrorGetServerCart({});
      setShowGetServerCartToast(false);
    } catch (error) {
      for (let errorObject of error.response.data.errors) {
        setErrorGetServerCart(errorObject);
        setShowGetServerCartToast(true);
      }
    }
  };

  const login = async () => {
    try {
      let { status, data } = await axios.post(`${API}/login`, {
        email: inputs.email,
        password: inputs.password,
      });

      localStorage.setItem("userEmail", data.email);
      localStorage.setItem("userToken", data.token);
      localStorage.setItem("tokenType", data.type);
      setErrorLogin({});
      setShowLoginToast(true);
      axios.defaults.headers.common = {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        "Access-Control-Allow-Origin": "*",
      };
      await getProfile();
      if (
        localStorage.getItem("userRole") === "ROLE_CUSTOMER" &&
        localStorage.getItem("cart")
      ) {
        await mergeToServerCart();
      }
      if (localStorage.getItem("userRole") === "ROLE_CUSTOMER") {
        await getServerCart();
      }
      setTimeout(() => {
        if (location.state) {
          navigate(`${location.state.from.pathname}`);
        } else {
          navigate("/");
        }
      }, 3000);
    } catch (error) {
      setInputs({ ...inputs, password: "" });
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userToken");
      localStorage.removeItem("tokenType");
      for (let errorObject of error.response.data.errors) {
        setErrorLogin(errorObject);
        setShowLoginToast(true);
      }
    }
  };

  const handleSubmit = async (e) => {
    const form = e.currentTarget;

    setValidated(true);
    e.preventDefault();
    if (form.checkValidity()) {
      await login();
    }
  };

  return (
    <>
      <NavbarComponent navStyle="simple" />
      <>
        <Container className="container d-flex justify-content-center flex-column align-items-center mt-5 pt-5">
          {localStorage.getItem("userToken") ? (
            <>
              <h3 className="main-title">You are logged in.</h3>
              <LinkContainer to="/">
                <Button variant="outline-primary">Go to Home Page</Button>
              </LinkContainer>
            </>
          ) : (
            <>
              <h1 className="main-title mb-4">Login to your account</h1>
              <Form
                className="login-form"
                noValidate
                validated={validated}
                onSubmit={handleSubmit}
              >
                <InputGroup className="mb-3">
                  <InputGroup.Text>
                    <FaUser />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    name="email"
                    value={inputs.email}
                    onChange={handleChange}
                    placeholder="Email"
                    aria-label="Email"
                    aria-describedby="basic-addon1"
                    pattern="([a-zA-Z0-9]+(?:[._+-][a-zA-Z0-9]+)*)@([a-zA-Z0-9]+(?:[.-][a-zA-Z0-9]+)*[.][a-zA-Z]{2,})"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid email address.
                  </Form.Control.Feedback>
                </InputGroup>
                <InputGroup className="mb-3">
                  <InputGroup.Text>
                    <FaUnlock />
                  </InputGroup.Text>
                  <Form.Control
                    type="password"
                    name="password"
                    value={inputs.password}
                    onChange={handleChange}
                    placeholder="Password"
                    aria-label="Password"
                    aria-describedby="basic-addon1"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a password.
                  </Form.Control.Feedback>
                </InputGroup>
                <div className="text-center">
                  <Button
                    type="submit"
                    variant="outline-primary"
                    className="w-100 mt-3"
                  >
                    Login
                  </Button>
                  <Row>
                    <Col xs={12}>
                      <Form.Text>
                        Forget your password?{" "}
                        <LinkContainer
                          to="/recovery"
                          className="recovery-link text-primary"
                        >
                          <span>Recovery</span>
                        </LinkContainer>
                      </Form.Text>
                    </Col>
                    <Col xs={12}>
                      <Form.Text>
                        You don't have an account?{" "}
                        <LinkContainer
                          to="/register"
                          className="register-link text-primary"
                        >
                          <span>Register</span>
                        </LinkContainer>
                      </Form.Text>
                    </Col>
                  </Row>
                </div>
              </Form>
            </>
          )}
        </Container>
        <div className="login-footer">
          <FooterComponent />
        </div>
      </>
      <ToastContainer className="position-fixed p-3 top-0 end-0">
        {Object.keys(errorLogin).length > 0 ? (
          <Toast
            onClose={() => setShowLoginToast(false)}
            show={showLoginToast}
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
            <Toast.Body>{errorLogin.message}</Toast.Body>
          </Toast>
        ) : (
          <Toast
            onClose={() => setShowLoginToast(false)}
            show={showLoginToast}
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
            <Toast.Body>Successfully logged in!</Toast.Body>
          </Toast>
        )}
      </ToastContainer>
      <ToastContainer className="position-fixed p-3 top-0 end-0">
        {Object.keys(errorMergeToServerCart).length > 0 && (
          <Toast
            onClose={() => setShowMergeToServerCartToast(false)}
            show={showMergeToServerCartToast}
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
            <Toast.Body>{errorMergeToServerCart.message}</Toast.Body>
          </Toast>
        )}
      </ToastContainer>
      <ToastContainer className="position-fixed p-3 top-0 end-0">
        {Object.keys(errorGetServerCart).length > 0 && (
          <Toast
            onClose={() => setShowGetServerCartToast(false)}
            show={showGetServerCartToast}
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
            <Toast.Body>{errorGetServerCart.message}</Toast.Body>
          </Toast>
        )}
      </ToastContainer>
    </>
  );
}
