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

function NavbarComponent(props) {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userToken");
    localStorage.removeItem("tokenType");
    localStorage.removeItem("userName");
    localStorage.removeItem("userImage");
    localStorage.removeItem("userPhone");
    localStorage.removeItem("userAddress");
    localStorage.removeItem("userGender");
    localStorage.removeItem("userBirthdate");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userCreateTime");
    localStorage.removeItem("userUpdateTime");
    localStorage.removeItem("cart");
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
            <Navbar.Brand>
              <AiOutlineStock className="text-primary" />{" "}
              <span className="text-white">Quant Assistant</span>
            </Navbar.Brand>
          </LinkContainer>
          {props.navStyle !== "simple" && (
            <>
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto">
                  <LinkContainer to="/category" className="nav-tab-link">
                    <Button variant="link" className="nav-item">
                      Category
                    </Button>
                  </LinkContainer>
                  <LinkContainer to="/product" className="nav-tab-link">
                    <Button variant="link" className="nav-item">
                      Product
                    </Button>
                  </LinkContainer>
                  <LinkContainer to="/news" className="nav-tab-link">
                    <Button variant="link" className="nav-item">
                      News
                    </Button>
                  </LinkContainer>
                  <LinkContainer to="/subscription" className="nav-tab-link">
                    <Button variant="link" className="nav-item">
                      Subscription
                    </Button>
                  </LinkContainer>
                </Nav>
                <Nav>
                  <LinkContainer to="/cart" className="nav-tab-link">
                    <Button variant="link" className="nav-item">
                      <BsCartFill />
                      Cart{" "}
                      <Badge bg="secondary">
                        {props.cartOrderDetailCount}
                      </Badge>{" "}
                    </Button>
                  </LinkContainer>
                  {localStorage.getItem("userToken") ? (
                    <Button variant="link" className="nav-item nav-tab-link">
                      <FaUser />
                      <NavDropdown
                        title={
                          localStorage.getItem("userEmail")
                            ? localStorage.getItem("userEmail")
                            : "User"
                        }
                        menuVariant="light"
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
                      <Button variant="link" className="nav-tab-link">
                        Login
                      </Button>
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
          <Toast.Header className="bg-info">
            <img
              src="holder.js/20x20?text=%20"
              className="rounded me-2"
              alt=""
            />
            <strong className="me-auto text-light">Info</strong>
          </Toast.Header>
          <Toast.Body>You've been logged out!</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}

export default NavbarComponent;
