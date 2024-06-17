import {
  Navbar,
  Container,
  Nav,
  Button,
  Badge,
  NavDropdown,
  ToastContainer,
  Toast,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { AiOutlineStock } from 'react-icons/ai';
import { BsCartFill } from 'react-icons/bs';
import { FaUser } from 'react-icons/fa';
import '@/style/components/commons/Navbar.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthService from '@/hooks/useAuthService';

const NavbarComponent: React.FC<NavbarComponentProps> = (
  props: NavbarComponentProps,
) => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const { removeUserData } = useAuthService();

  const handleLogout = () => {
    removeUserData();
    setShow(true);
    setTimeout(() => {
      navigate('/');
    }, 3000);
  };

  return (
    <>
      <Navbar
        collapseOnSelect
        expand="lg"
        bg="dark"
        variant="dark"
        className={`${props.navbarClassname}`}
      >
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>
              <AiOutlineStock className="text-primary" />{' '}
              <span className="text-white tw-pl-1">Quant Assistant</span>
            </Navbar.Brand>
          </LinkContainer>
          {props.navStyle !== 'simple' && (
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
                      Yahoo Finance
                    </Button>
                  </LinkContainer>
                  <LinkContainer to="/services/stocks" className="nav-tab-link">
                    <Button variant="link" className="nav-item">
                      Services
                    </Button>
                  </LinkContainer>
                  <LinkContainer to="/news" className="nav-tab-link">
                    <Button variant="link" className="nav-item">
                      News
                    </Button>
                  </LinkContainer>
                  Nav
                </Nav>
                <Nav>
                  {localStorage.getItem('userRole') === 'ROLE_EMPLOYEE' ||
                  localStorage.getItem('userRole') === 'ROLE_MANAGER' ? (
                    <LinkContainer to="/order" className="nav-tab-link">
                      <Button variant="link" className="nav-item">
                        <BsCartFill />
                        Order
                      </Button>
                    </LinkContainer>
                  ) : (
                    <LinkContainer to="/cart" className="nav-tab-link">
                      <Button variant="link" className="nav-item">
                        <BsCartFill />
                        Cart
                        <Badge bg="secondary">
                          {props.cartOrderDetailCount}
                        </Badge>{' '}
                      </Button>
                    </LinkContainer>
                  )}
                  {localStorage.getItem('userToken') ? (
                    <Button variant="link" className="nav-item nav-tab-link">
                      <FaUser />
                      <NavDropdown
                        title={
                          localStorage.getItem('userEmail')
                            ? localStorage.getItem('userEmail')
                            : 'User'
                        }
                        menuVariant="light"
                      >
                        <LinkContainer to="/profile">
                          <NavDropdown.Item>Profile</NavDropdown.Item>
                        </LinkContainer>
                        {localStorage.getItem('userRole') ===
                          'ROLE_CUSTOMER' && (
                          <>
                            <LinkContainer to="/order">
                              <NavDropdown.Item>Order</NavDropdown.Item>
                            </LinkContainer>
                          </>
                        )}
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
      <>
        <ToastContainer className="position-fixed p-3 top-0 end-0">
          <Toast
            onClose={() => setShow(false)}
            show={show}
            delay={3000}
            autohide
          >
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
    </>
  );
};

type NavbarComponentProps = {
  navbarClassname?: string;
  navStyle?: string;
  cartOrderDetailCount?: number;
};

NavbarComponent.defaultProps = {
  navbarClassname: '',
  navStyle: '',
  cartOrderDetailCount: 0,
};

export default NavbarComponent;
