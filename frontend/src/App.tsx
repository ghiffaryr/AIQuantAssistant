import './App.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import PageRoutes from './routes/routes';
import { BrowserRouter } from 'react-router-dom';
import setupGlobalAxiosInterceptor from './api/setupGlobalAxiosInterceptor';
import { MantineProvider } from '@mantine/core';
// core styles are required for all packages
import '@mantine/core/styles.css';
import '@mantine/core/styles/global.css';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 300 * 1000 } },
});

function App() {
  setupGlobalAxiosInterceptor();
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <MantineProvider>
          <BrowserRouter>
            <PageRoutes />
          </BrowserRouter>
        </MantineProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
}

export default App;
