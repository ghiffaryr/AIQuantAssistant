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
import useBoundStore from '@/store/store';
import Role from '@/enums/RoleEnum';
import { useQueryClient } from '@tanstack/react-query';
import { resetAllSlices } from '@/store/resetStore';

const NavbarComponent: React.FC<NavbarComponentProps> = (
  props: NavbarComponentProps,
) => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const userEmail = useBoundStore.use.userEmail?.();
  const userToken = useBoundStore.use.userToken?.();
  const userRole = useBoundStore.use.userRole?.();

  const handleLogout = async () => {
    useBoundStore.persist.clearStorage();
    resetAllSlices();
    // invalidate all the queries in the cache
    await queryClient.invalidateQueries();
    setShow(true);
    setTimeout(() => {
      console.log('halo');
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
        className={`${props.navbarClassname}`}>
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
                  {userRole === Role.Employee || userRole === Role.Manager ? (
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
                  {userToken ? (
                    <Button variant="link" className="nav-item nav-tab-link">
                      <FaUser />
                      <NavDropdown
                        title={userEmail ? userEmail : 'User'}
                        menuVariant="light">
                        <LinkContainer to="/profile">
                          <NavDropdown.Item>Profile</NavDropdown.Item>
                        </LinkContainer>
                        {userRole === Role.Customer && (
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
            autohide>
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
