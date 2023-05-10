import React, { useState } from "react";
import Container from "react-bootstrap/esm/Container";
import Form from "react-bootstrap/Form";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import FooterComponent from "../../../components/basic/FooterComponent";
import NavbarComponent from "../../../components/basic/NavbarComponent";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/esm/Button";
import "../../../css/pages/main/login/Register.css";
import { API } from "../../../env/Constants";
import { storage } from "../../../env/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import axios from "axios";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { BsQuestionCircleFill } from "react-icons/bs";

export default function RegisterPage() {
  const [inputs, setInputs] = useState({
    image: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    coPassword: "",
    recoveryPhrase: "",
    phone: "",
    address: "",
    gender: null,
    birthdate: "",
    role: "ROLE_CUSTOMER",
  });
  const [showRegisterToast, setShowRegisterToast] = useState(false);
  const [errorRegister, setErrorRegister] = useState({});
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setInputs({
      ...inputs,
      [e.target.name]:
        e.target.name === "gender" && e.target.value === "male"
          ? true
          : e.target.name === "gender" && e.target.value === "female"
          ? false
          : e.target.value,
    });
  }

  const handleSubmit = async (e) => {
    const form = e.currentTarget;

    setValidated(true);
    e.preventDefault();
    if (form.checkValidity()) {
      try {
        let { status, data } = await axios.post(`${API}/register`, {
          ...Object.fromEntries(
            Object.entries(inputs).filter(
              ([key, value]) =>
                key !== "firstName" &&
                key !== "lastName" &&
                key !== "coPassword" &&
                value !== "" &&
                value !== null
            )
          ),
          name: `${inputs.firstName} ${inputs.lastName}`,
          birthdate: new Date(inputs.birthdate).toISOString(),
        });

        setErrorRegister({});
        setShowRegisterToast(true);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } catch (error) {
        setInputs({
          ...inputs,
          password: "",
          coPassword: "",
          recoveryPhrase: "",
        });
        for (let errorObject of error.response.data.errors) {
          setErrorRegister(errorObject);
          setShowRegisterToast(true);
        }
      }
    }
  };

  function upload(e) {
    e.preventDefault();
    const fileName = e.target.files[0].name;
    const storageRef = ref(storage, `${fileName}`);
    uploadBytes(storageRef, e.target.files[0])
      .then((snapshot) => {
        return getDownloadURL(storageRef);
      })
      .then((downloadURL) => {
        setInputs({
          ...inputs,
          image: downloadURL,
        });
      })
      .catch((err) => {
        setErrorRegister({ code: 500, message: "Upload failed!" });
        setShowRegisterToast(true);
      });
  }

  return (
    <>
      <NavbarComponent navStyle="simple" />
      <>
        <Container className="container register-main d-flex justify-content-center flex-column align-items-center my-5 pt-5">
          {localStorage.getItem("user_token") ? (
            <>
              <h3 className="main-title">You are already registered.</h3>
              <LinkContainer to="/">
                <Button variant="outline-danger">Go back to Home page</Button>
              </LinkContainer>
            </>
          ) : (
            <>
              <h1 className="main-title mb-4">Register a new account</h1>
              <Form
                className="login-form"
                noValidate
                validated={validated}
                onSubmit={handleSubmit}
              >
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="validationCustom01"
                >
                  <Form.Label column sm="4">
                    Profile Picture
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={upload}
                      placeholder="Upload Profile Picture"
                      aria-label="Upload Profile Picture"
                      aria-describedby="basic-addon1"
                    />
                  </Col>
                </Form.Group>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="validationCustom02"
                >
                  <Form.Label column sm="4">
                    <div className="d-inline-flex">
                      First Name&nbsp;<span className="text-danger">*</span>
                    </div>
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      aria-label="First Name"
                      value={inputs.firstName}
                      onChange={handleChange}
                      pattern="^[A-Za-z]{1,30}"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide a valid first name.
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="validationCustom03"
                >
                  <Form.Label column sm="4">
                    Last Name&nbsp;<span className="text-danger">*</span>
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      aria-label="Last Name"
                      value={inputs.lastName}
                      onChange={handleChange}
                      pattern="^[A-Za-z]{1,30}"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide a valid last name.
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="validationCustom04"
                >
                  <Form.Label column sm="4">
                    Email Address&nbsp;<span className="text-danger">*</span>
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      type="email"
                      placeholder="Email Address"
                      aria-label="Email Address"
                      name="email"
                      value={inputs.email}
                      onChange={handleChange}
                      pattern="([a-zA-Z0-9]+(?:[._+-][a-zA-Z0-9]+)*)@([a-zA-Z0-9]+(?:[.-][a-zA-Z0-9]+)*[.][a-zA-Z]{2,})"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide a valid email address.
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="validationCustom05"
                >
                  <Form.Label column sm="4">
                    <div className="d-inline-flex">
                      Password&nbsp;<span className="text-danger">*</span>
                      &nbsp;
                      <span className="d-flex align-items-center">
                        <OverlayTrigger
                          placement={"top"}
                          overlay={
                            <Tooltip id={"tooltip-top"}>
                              <p style={{ textAlign: "left" }}>
                                The password needs to:{" "}
                              </p>
                              <ul>
                                <li style={{ textAlign: "left" }}>
                                  include both lower and upper case characters
                                </li>
                                <li style={{ textAlign: "left" }}>
                                  include at least one number and one special
                                  character
                                </li>
                                <li style={{ textAlign: "left" }}>
                                  be at least 8 characters long.
                                </li>
                              </ul>
                            </Tooltip>
                          }
                        >
                          <div
                            className="input d-flex align-items-center"
                            type="button"
                            style={{
                              borderRadius: "50%",
                              width: "1rem",
                              height: "1rem",
                            }}
                          >
                            <BsQuestionCircleFill />
                          </div>
                        </OverlayTrigger>
                      </span>
                    </div>
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="Password"
                      aria-label="Password"
                      value={inputs.password}
                      onChange={handleChange}
                      pattern="^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^A-Za-z0-9]).{8,}$"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      <p>
                        Please provide a valid password. The password needs to:{" "}
                      </p>
                      <ul>
                        <li>include both lower and upper case characters</li>
                        <li>
                          include at least one number and one special character
                        </li>
                        <li>be at least 8 characters long.</li>
                      </ul>
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="validationCustom06"
                >
                  <Form.Label column sm="4">
                    Confirm Password <span className="text-danger">*</span>
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      type="password"
                      name="coPassword"
                      placeholder="Confirm Password"
                      aria-label="Confirm Password"
                      value={inputs.coPassword}
                      onChange={handleChange}
                      pattern={inputs.password}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Passwords don't match.
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="validationCustom07"
                >
                  <Form.Label column sm="4">
                    Recovery Phrase <span className="text-danger">*</span>
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      type="password"
                      name="recoveryPhrase"
                      placeholder="Recovery Phrase"
                      aria-label="Recovery Phrase"
                      value={inputs.recoveryPhrase}
                      onChange={handleChange}
                      pattern="^(?!\s*$).+"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Recovery phrase cannot be blank.
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="validationCustom08"
                >
                  <Form.Label column sm="4">
                    Phone
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      type="text"
                      name="phone"
                      placeholder="Phone"
                      aria-label="Phone"
                      value={inputs.phone}
                      onChange={handleChange}
                      pattern="^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$"
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide a valid phone number.
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="validationCustom09"
                >
                  <Form.Label column sm="4">
                    Address
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      type="text"
                      name="address"
                      placeholder="Address"
                      aria-label="Address"
                      value={inputs.address}
                      onChange={handleChange}
                      pattern="^(?!\s*$).+"
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide a valid address.
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="validationCustom10"
                >
                  <Form.Label column sm="4">
                    Gender
                  </Form.Label>
                  <Col sm="8" className="d-flex align-items-center">
                    <Form.Check
                      inline
                      label="Male"
                      name="gender"
                      value="male"
                      type={"radio"}
                      id="inline-radio-gender-male"
                      onChange={handleChange}
                    />
                    <Form.Check
                      inline
                      label="Female"
                      name="gender"
                      value="female"
                      type={"radio"}
                      id="inline-radio-gender-female"
                      onChange={handleChange}
                    />
                  </Col>
                </Form.Group>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="validationCustom11"
                >
                  <Form.Label column sm="4">
                    Birth Date
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      type="date"
                      name="birthdate"
                      placeholder="Birth Date"
                      aria-label="Birth Date"
                      onChange={handleChange}
                    />
                  </Col>
                </Form.Group>
                <div className="text-center">
                  <Button
                    type="submit"
                    variant="outline-primary"
                    className="w-50 mt-3"
                  >
                    Register
                  </Button>
                  <br />
                  <Form.Text>
                    Already have an account?{" "}
                    <LinkContainer
                      to="/login"
                      className="login-link text-primary"
                    >
                      <span>Login</span>
                    </LinkContainer>
                  </Form.Text>
                </div>
              </Form>
            </>
          )}
        </Container>
        <FooterComponent />
      </>
      <ToastContainer className="position-fixed p-3 top-0 end-0">
        {Object.keys(errorRegister).length > 0 ? (
          <Toast
            onClose={() => setShowRegisterToast(false)}
            show={showRegisterToast}
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
            <Toast.Body>{errorRegister.message}</Toast.Body>
          </Toast>
        ) : (
          <Toast
            onClose={() => setShowRegisterToast(false)}
            show={showRegisterToast}
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
            <Toast.Body>Successfully registered! Please log in!</Toast.Body>
          </Toast>
        )}
      </ToastContainer>
    </>
  );
}
