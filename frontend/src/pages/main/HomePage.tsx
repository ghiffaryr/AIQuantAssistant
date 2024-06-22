/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from 'react-bootstrap/esm/Button';
import { LinkContainer } from 'react-router-bootstrap';
import FooterComponent from '@/components/commons/FooterComponent';
import NavbarComponent from '@/components/commons/NavbarComponent';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import '@/style/pages/main/HomePage.css';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/esm/ToastContainer';
import useServerCart from '@/hooks/useServerCart';

const HomePage = () => {
  const {
    cartOrderDetailCount,
    errorGetServerCart,
    setShowGetServerCartToast,
    showGetServerCartToast,
  } = useServerCart();
  return (
    <>
      <NavbarComponent cartOrderDetailCount={cartOrderDetailCount} />
      <>
        <main className="main-homepage pt-5">
          <Row className="main-content d-flex justify-content-start align-items-center">
            <Col xs={1}></Col>
            <Col md={4} sm={8} xs={11}>
              <h3 className="text-white">
                Assist your quantitative analysis by our AI quant assistant at
                affordable price
              </h3>
              <LinkContainer to="/category">
                <Button variant="outline-light" className="mt-2">
                  See more
                </Button>
              </LinkContainer>
            </Col>
            <Col xs={7}></Col>
          </Row>
        </main>
        <FooterComponent position="absolute" color="white" />
      </>
      <ToastContainer className="position-fixed p-3 top-0 end-0">
        {Object.keys(errorGetServerCart).length > 0 && (
          <Toast
            onClose={() => setShowGetServerCartToast(false)}
            show={showGetServerCartToast}
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
            <Toast.Body>{(errorGetServerCart as any).message}</Toast.Body>
          </Toast>
        )}
      </ToastContainer>
    </>
  );
};

export default HomePage;
