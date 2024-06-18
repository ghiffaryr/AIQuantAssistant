import '@/style/pages/exception/NotFoundPage.css';
import { Link } from 'react-router-dom';
import FooterComponent from '@/components/commons/FooterComponent';

export default function NotFoundPage() {
  return (
    <>
      <div className="main-notfound">
        <div className="notfound-content">
          <h3 className="notfound-header">
            The requested page not found on this server.
          </h3>
          <h4 className="notfound-link">
            Go back to <Link to="/">Home Page</Link>
          </h4>
        </div>
      </div>
      <div className="login-footer">
        <FooterComponent position="absolute" color="white" />
      </div>
    </>
  );
}