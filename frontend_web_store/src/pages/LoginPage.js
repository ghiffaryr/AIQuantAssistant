import Container from "react-bootstrap/esm/Container";
import Form from "react-bootstrap/Form";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import InputGroup from "react-bootstrap/InputGroup";
import FooterComponent from "../components/FooterComponent";
import NavbarComponent from "../components/NavbarComponent";
import { FaUser } from "react-icons/fa";
import { FaUnlock } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/esm/Button";
import { useState } from "react";
import "../css/LoginPage.css";
import { BASE_URL } from "../env/Constants";
import { useDispatch, useSelector } from "react-redux";

function LoginPage() {
  const [inputs, setInputs] = useState({ email: "", password: "" });
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const loggedIn = useSelector((state) => state.loggedIn);
  // let loggedIn = false;

  if (
    localStorage.getItem("user_email") &&
    localStorage.getItem("user_name") &&
    localStorage.getItem("user_role") &&
    localStorage.getItem("user_token") &&
    localStorage.getItem("token_type")
  ) {
    dispatch({ type: "loggedIn" });
    // loggedIn = true;
  }

  function handleChange(e) {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
    const form = e.currentTarget;

    setValidated(true);
    e.preventDefault();
    if (form.checkValidity()) {
      fetch(`${BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: inputs.email,
          password: inputs.password,
        }),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error(response.status);
          }
        })
        .then((data) => {
          console.log(data);
          if (data) {
            setError(false);
            localStorage.setItem("user_email", data.email);
            localStorage.setItem("user_name", data.name);
            localStorage.setItem("user_role", data.role);
            localStorage.setItem("user_token", data.token);
            localStorage.setItem("token_type", data.type);
            setShow(true);
            setTimeout(() => {
              navigate("/");
            }, 3000);
          }
        })
        .catch((error) => {
          setError(error);
          setInputs({ ...inputs, password: "" });
          localStorage.removeItem("user_email");
          localStorage.removeItem("user_name");
          localStorage.removeItem("user_role");
          localStorage.removeItem("user_token");
          localStorage.removeItem("token_type");
          setShow(true);
        });
    }
  }

  return (
    <>
      <NavbarComponent navStyle="simple" />
      <>
        <Container className="container d-flex justify-content-center flex-column align-items-center mt-5 pt-5">
          {loggedIn ? (
            <>
              <h3 className="main-title">You are logged in.</h3>
              <LinkContainer to="/">
                <Button variant="outline-danger">Go to Home page</Button>
              </LinkContainer>
            </>
          ) : (
            <>
              <h1 className="main-title">Login to your account</h1>
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
                  <Form.Text>
                    You don't have an account?{" "}
                    <LinkContainer
                      to="/register"
                      className="register-link text-primary"
                    >
                      <span>Register</span>
                    </LinkContainer>
                  </Form.Text>
                </div>
              </Form>
            </>
          )}
        </Container>
        <div className="login-footer">
          <FooterComponent />
        </div>
      </>
      <ToastContainer className="p-3 top-0 end-0">
        <Toast onClose={() => setShow(false)} show={show} delay={3000} autohide>
          {error ? (
            <>
              <Toast.Header>
                <img
                  src="holder.js/20x20?text=%20"
                  className="rounded me-2"
                  alt=""
                />
                <strong className="me-auto text-danger">Error!</strong>
              </Toast.Header>
              <Toast.Body>
                {error.message === "401"
                  ? "The email or the password are incorrect! Please try again."
                  : `This is an HTTP error: The status is ${error.message}`}
              </Toast.Body>
            </>
          ) : (
            <Toast.Body>Successfully logged in!</Toast.Body>
          )}
        </Toast>
      </ToastContainer>
    </>
  );
}

export default LoginPage;
