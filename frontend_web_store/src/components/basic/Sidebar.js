import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { LinkContainer } from 'react-router-bootstrap';
import { Button } from 'react-bootstrap';
import NavbarComponent from './NavbarComponent';

export default function Sidebar({children}) {
  const [opened] = useDisclosure();
  
  const navbarContent  = [
    {
        name: "Stock",
        icon: (<i class="bi bi-file-bar-graph pe-2"></i>),
        link: "/services/stocks"
    },
    {
        name: "Forecasting",
        icon: (<i class="bi bi-graph-up pe-2"></i>),
        link: "/services/forecasting"
    },
    {
        name: "Sentiment Analysis",
        icon: (<i class="bi bi-pen-fill pe-2"></i>),
        link: "/services/sentiment-analysis"
    },
    {
        name: "Narrative Summary",
        icon: (<i class="bi bi-card-text pe-2"></i>),
        link: "/services/summary"
    },
    {
        name: "Analysis Result",
        icon: (<i class="bi bi-clipboard-data pe-2"></i>),
        link: "/services/result"
    }
  ]

  return (
    <AppShell
      header={{ height: 70 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <NavbarComponent navbarClassname="navbar-height-inherit" />
      </AppShell.Header>
      <AppShell.Navbar p="md" bg="dark">
        {navbarContent.map((val) => (
            <LinkContainer to={val.link} className="nav-tab-link pt-5">
                <Button variant="link" className="nav-item fs-5">
                    {val.icon} {val.name}
                </Button>
            </LinkContainer> 
        ))}
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}