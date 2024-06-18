import './App.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import PageRoutes from './routes/routes';
import { BrowserRouter } from 'react-router-dom';
import setupGlobalAxiosInterceptor from './api/setupGlobalAxiosInterceptor';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 300 * 1000 } },
});

function App() {
  setupGlobalAxiosInterceptor();
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <PageRoutes />
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
}

export default App;
