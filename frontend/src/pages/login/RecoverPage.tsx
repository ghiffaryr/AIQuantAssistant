/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import Container from 'react-bootstrap/esm/Container';
import Form from 'react-bootstrap/Form';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import InputGroup from 'react-bootstrap/InputGroup';
import FooterComponent from '@/components/commons/FooterComponent';
import NavbarComponent from '@/components/commons/NavbarComponent';
import { FaUser } from 'react-icons/fa';
import { VscSymbolKey } from 'react-icons/vsc';
import { LinkContainer } from 'react-router-bootstrap';
import Button from 'react-bootstrap/esm/Button';
import '@/style/pages/main/login/RecoverPage.css';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import { useRecover } from '@/api/auth';
import errorHandler from '@/utils/error';

const RecoverPage = () => {
  const [inputs, setInputs] = useState({ email: '', recoveryPhrase: '' });
  const [recoverPassword, setRecoverPassword] = useState('');
  const [showRecoverToast, setShowRecoverToast] = useState(false);
  const [errorRecover, setErrorRecover] = useState<any>({});
  const [validated, setValidated] = useState(false);

  const recoverMutation = useRecover({
    successSideEffect: val => {
      const { data } = val;
      setErrorRecover({});
      setShowRecoverToast(true);
      setRecoverPassword(data.password);
    },
    onError: error => {
      setInputs({ ...inputs, recoveryPhrase: '' });
      setRecoverPassword('');

      errorHandler({
        error,
        axiosErrorHandlerFn: err => {
          setErrorRecover(err);
          setShowRecoverToast(true);
        },
        generalErrorHandlerFn: err => {
          setErrorRecover(err);
          setShowRecoverToast(true);
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

  const handleSubmit = (e: any) => {
    const form = e.currentTarget;

    setValidated(true);
    e.preventDefault();
    if (form.checkValidity()) {
      recoverMutation.mutate(inputs);
    }
  };

  return (
    <>
      <NavbarComponent navStyle="simple" />
      <>
        <Container className="container d-flex justify-content-center flex-column align-items-center mt-5 pt-5">
          {localStorage.getItem('userToken') ? (
            <>
              <h3 className="main-title">You are logged in.</h3>
              <LinkContainer to="/">
                <Button variant="outline-primary">Go to Home Page</Button>
              </LinkContainer>
            </>
          ) : recoverPassword ? (
            <>
              <h3 className="main-title">
                Your new password is {recoverPassword}
              </h3>
              <h3 className="main-title">Please log in.</h3>
              <LinkContainer to="/login">
                <Button variant="outline-primary">Go to Login Page</Button>
              </LinkContainer>
            </>
          ) : (
            <>
              <h1 className="main-title mb-4">Recover your account</h1>
              <Form
                className="login-form"
                noValidate
                validated={validated}
                onSubmit={handleSubmit}>
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
                    className="w-100 mt-3">
                    Recover
                  </Button>
                  <Row>
                    <Col xs={12}>
                      <Form.Text>
                        Remember your password?{' '}
                        <LinkContainer
                          to="/login"
                          className="login-link text-primary">
                          <span>Login</span>
                        </LinkContainer>
                      </Form.Text>
                    </Col>
                    <Col xs={12}>
                      <Form.Text>
                        You don't have an account?{' '}
                        <LinkContainer
                          to="/register"
                          className="register-link text-primary">
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
        {Object.keys(errorRecover).length > 0 && (
          <Toast
            onClose={() => setShowRecoverToast(false)}
            show={showRecoverToast}
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
            <Toast.Body>{errorRecover.message}</Toast.Body>
          </Toast>
        )}
      </ToastContainer>
    </>
  );
};

export default RecoverPage;
