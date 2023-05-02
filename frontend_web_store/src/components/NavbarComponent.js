import Button from "react-bootstrap/Button";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import NavDropdown from "react-bootstrap/NavDropdown";
import Badge from "react-bootstrap/Badge";
import { LinkContainer } from "react-router-bootstrap";
import { useEffect, useState } from "react";
import { BsCartFill } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import { AiOutlineStock } from "react-icons/ai";
import { useNavigate } from "react-router";
import "../css/Navbar.css";
import { useDispatch, useSelector } from "react-redux";

function NavbarComponent(props) {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loggedIn = useSelector((state) => state.loggedIn);
  // let loggedIn = false;
  let email;

  if (
    localStorage.getItem("user_email") &&
    localStorage.getItem("user_name") &&
    localStorage.getItem("user_role") &&
    localStorage.getItem("user_token") &&
    localStorage.getItem("token_type")
  ) {
    dispatch({ type: "loggedIn" });
    // loggedIn = true;
    email = localStorage.getItem("user_email");
  }

  function handleLogout() {
    dispatch({ type: "loggedOff" });
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_token");
    localStorage.removeItem("token_type");
    setShow(true);
    setTimeout(() => {
      navigate("/");
    }, 3000);
  }

  return (
    <>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand className="text-white">
              <AiOutlineStock /> Quant Assistant
            </Navbar.Brand>
          </LinkContainer>
          {props.navStyle !== "simple" && (
            <>
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto">
                  <LinkContainer to="/category">
                    <Button variant="link" className="nav-item">
                      Category
                    </Button>
                  </LinkContainer>
                  <LinkContainer to="/product">
                    <Button variant="link" className="nav-item">
                      Product
                    </Button>
                  </LinkContainer>
                  <LinkContainer to="/news">
                    <Button variant="link" className="nav-item">
                      News
                    </Button>
                  </LinkContainer>
                </Nav>
                <Nav>
                  <LinkContainer to="/cart">
                    <Button variant="link" className="nav-item">
                      <BsCartFill />
                      Cart <Badge bg="secondary">
                        {props.cartItemsNumber}
                      </Badge>{" "}
                    </Button>
                  </LinkContainer>
                  {loggedIn ? (
                    <Button variant="link" className="nav-item">
                      <FaUser />
                      <NavDropdown
                        title={email}
                        id="nav-dropdown-dark-example"
                        menuVariant="dark"
                      >
                        <LinkContainer to="/profile">
                          <NavDropdown.Item>Profile Settings</NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer to="/orders">
                          <NavDropdown.Item>Order History</NavDropdown.Item>
                        </LinkContainer>
                        <NavDropdown.Item onClick={handleLogout}>
                          Logout
                        </NavDropdown.Item>
                      </NavDropdown>
                    </Button>
                  ) : (
                    <LinkContainer to="/login">
                      <Button variant="outline-light">Login</Button>
                    </LinkContainer>
                  )}
                </Nav>
              </Navbar.Collapse>
            </>
          )}
        </Container>
      </Navbar>
      <ToastContainer className="p-3 top-0 end-0">
        <Toast onClose={() => setShow(false)} show={show} delay={3000} autohide>
          <Toast.Body>You've been logged out!</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}

export default NavbarComponent;
