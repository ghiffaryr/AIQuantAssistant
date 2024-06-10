import './App.css';
import PageRoutes from './routes/routes';
import { BrowserRouter } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <>
      <BrowserRouter>
        <PageRoutes />
      </BrowserRouter>
    </>
  );
}

export default App;
