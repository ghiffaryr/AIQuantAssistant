/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import Container from 'react-bootstrap/esm/Container';
import Form from 'react-bootstrap/Form';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import InputGroup from 'react-bootstrap/InputGroup';
import FooterComponent from '@/components/commons/FooterComponent';
import NavbarComponent from '@/components/commons/NavbarComponent';
import { FaUser, FaUnlock } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import Button from 'react-bootstrap/esm/Button';
import '@/style/pages/main/LoginPage.css';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import useLogin from '@/hooks/useLogin';

export default function LoginPage() {
  const [validated, setValidated] = useState(false);
  const {
    inputs,
    setInputs,
    login,
    userToken,
    errorGetServerCart,
    errorLogin,
    setShowGetServerCartToast,
    setShowLoginToast,
    showGetServerCartToast,
    showLoginToast,
  } = useLogin();

  function handleChange(e: any) {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  }

  const handleSubmit = async (e: any) => {
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
          {userToken ? (
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
                        Forget your password?{' '}
                        <LinkContainer
                          to="/recover"
                          className="recover-link text-primary"
                        >
                          <span>Recover</span>
                        </LinkContainer>
                      </Form.Text>
                    </Col>
                    <Col xs={12}>
                      <Form.Text>
                        You don't have an account?{' '}
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
        <FooterComponent position="absolute" />
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
