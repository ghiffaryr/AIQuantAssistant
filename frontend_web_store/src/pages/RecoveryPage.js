import React, { useState } from "react";
import Container from "react-bootstrap/esm/Container";
import Form from "react-bootstrap/Form";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import InputGroup from "react-bootstrap/InputGroup";
import FooterComponent from "../components/FooterComponent";
import NavbarComponent from "../components/NavbarComponent";
import { FaUser } from "react-icons/fa";
import { VscSymbolKey } from "react-icons/vsc";
import { LinkContainer } from "react-router-bootstrap";
import Button from "react-bootstrap/esm/Button";
import "../css/RecoveryPage.css";
import { API } from "../env/Constants";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import axios from "axios";

export default function RecoveryPage() {
  const [inputs, setInputs] = useState({ email: "", recoveryPhrase: "" });
  const [recoveryPassword, setRecoveryPassword] = useState("");
  const [showRecoveryToast, setShowRecoveryToast] = useState(false);
  const [errorRecovery, setErrorRecovery] = useState({});
  const [validated, setValidated] = useState(false);

  function handleChange(e) {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  }

  const handleRecovery = async () => {
    try {
      let { status, data } = await axios.put(`${API}/recovery`, {
        email: inputs.email,
        recoveryPhrase: inputs.recoveryPhrase,
      });

      setErrorRecovery({});
      setShowRecoveryToast(true);
      setRecoveryPassword(data.password);
    } catch (error) {
      setInputs({ ...inputs, recoveryPhrase: "" });
      setRecoveryPassword("");
      for (let errorObject of error.response.data.errors) {
        setErrorRecovery(errorObject);
        setShowRecoveryToast(true);
      }
    }
  };

  const handleSubmit = async (e) => {
    const form = e.currentTarget;

    setValidated(true);
    e.preventDefault();
    if (form.checkValidity()) {
      handleRecovery();
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
          ) : recoveryPassword ? (
            <>
              <h3 className="main-title">
                Your new password is {recoveryPassword}
              </h3>
              <h3 className="main-title">Please log in.</h3>
              <LinkContainer to="/login">
                <Button variant="outline-primary">Go to Login Page</Button>
              </LinkContainer>
            </>
          ) : (
            <>
              <h1 className="main-title">Recover your account</h1>
              <Form
                className="login-form mt-4"
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
                    pattern="([a-zA-Z0-9]+(?:[._+-][a-zA-Z0-9]+)*)@([a-zA-Z0-9]+(?:[.-][a-zA-Z0-9]+)*[.][a-zA-Z]{2,})"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid email address.
                  </Form.Control.Feedback>
                </InputGroup>
                <InputGroup className="mb-3">
                  <InputGroup.Text>
                    <VscSymbolKey />
                  </InputGroup.Text>
                  <Form.Control
                    type="password"
                    name="recoveryPhrase"
                    value={inputs.recoveryPhrase}
                    onChange={handleChange}
                    placeholder="Recovery Phrase"
                    aria-label="Recovery Phrase"
                    required
                  />
                </InputGroup>
                <div className="text-center">
                  <Button
                    type="submit"
                    variant="outline-primary"
                    className="w-100 mt-3"
                  >
                    Recover
                  </Button>
                  <Row>
                    <Col xs={12}>
                      <Form.Text>
                        Remember your password?{" "}
                        <LinkContainer
                          to="/login"
                          className="login-link text-primary"
                        >
                          <span>Login</span>
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
        <div className="recovery-footer">
          <FooterComponent position="absolute" />
        </div>
      </>
      <ToastContainer className="p-3 top-0 end-0">
        <Toast
          onClose={() => setShowRecoveryToast(false)}
          show={showRecoveryToast}
          delay={3000}
          autohide
        >
          {Object.keys(errorRecovery).length > 0 && (
            <>
              <Toast.Header className="bg-danger">
                <img
                  src="holder.js/20x20?text=%20"
                  className="rounded me-2"
                  alt=""
                />
                <strong className="me-auto text-light">Error</strong>
              </Toast.Header>
              <Toast.Body>{errorRecovery.message}</Toast.Body>
            </>
          )}
        </Toast>
      </ToastContainer>
    </>
  );
}
