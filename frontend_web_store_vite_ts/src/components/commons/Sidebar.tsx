import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { LinkContainer } from 'react-router-bootstrap';
import { Button, Toast, ToastContainer } from 'react-bootstrap';
import NavbarComponent from './NavbarComponent';
import useServerCart from '@/hooks/useServerCart';

export default function Sidebar({ children }: SidebarProps) {
  const [opened] = useDisclosure();
  const {
    cartOrderDetailCount,
    errorGetServerCart,
    setShowGetServerCartToast,
    showGetServerCartToast,
  } = useServerCart();

  //TODO: move to parent component
  const navbarContent = [
    {
      name: 'Stock',
      icon: <i className="bi bi-file-bar-graph pe-2"></i>,
      link: '/services/stocks',
    },
    {
      name: 'Forecasting',
      icon: <i className="bi bi-graph-up pe-2"></i>,
      link: '/services/forecasting',
    },
    {
      name: 'Sentiment Analysis',
      icon: <i className="bi bi-pen-fill pe-2"></i>,
      link: '/services/sentiment-analysis',
    },
    {
      name: 'Narrative Summary',
      icon: <i className="bi bi-card-text pe-2"></i>,
      link: '/services/summary',
    },
    {
      name: 'Analysis Result',
      icon: <i className="bi bi-clipboard-data pe-2"></i>,
      link: '/services/result',
    },
  ];

  return (
    <>
      <AppShell
        header={{ height: 70 }}
        navbar={{
          width: 300,
          breakpoint: 'sm',
          collapsed: { mobile: !opened },
        }}
        padding="md"
      >
        <AppShell.Header>
          <NavbarComponent
            navbarClassname="navbar-height-inherit"
            cartOrderDetailCount={cartOrderDetailCount}
          />
        </AppShell.Header>
        <AppShell.Navbar p="md" bg="dark">
          {navbarContent.map((val, index) => (
            <LinkContainer
              key={index}
              to={val.link}
              className="nav-tab-link pt-5"
            >
              <Button variant="link" className="nav-item fs-5">
                {val.icon} {val.name}
              </Button>
            </LinkContainer>
          ))}
        </AppShell.Navbar>
        <AppShell.Main>{children}</AppShell.Main>
      </AppShell>
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

type SidebarProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: any;
};
