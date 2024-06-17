import { Link } from 'react-router-dom';
import useBreadcrumbs from 'use-react-router-breadcrumbs';

function Breadcrumbs() {
  const breadcrumbs = useBreadcrumbs();
  const lastBreadcrumbs = breadcrumbs.slice(-1);

  const capitalizeFirstLetter = (val: string) => {
    return val.charAt(0).toUpperCase() + val.slice(1);
  };

  const formattedBreadcrumbs = lastBreadcrumbs[0].key.split('/');
  const formattedBreadcrumb = capitalizeFirstLetter(
    formattedBreadcrumbs[formattedBreadcrumbs.length - 1].replaceAll(
      '%20',
      ' ',
    ),
  );

  const firstBreadcrumbs = breadcrumbs.slice(0, breadcrumbs.length - 1);

  return (
    <div className="container py-4">
      {firstBreadcrumbs.map(({ breadcrumb }) => (
        <span key={breadcrumb?.toString()}>
          <Link to={breadcrumb?.toString() || ''}>{breadcrumb}</Link> /{' '}
        </span>
      ))}
      <span>{formattedBreadcrumb}</span>
    </div>
  );
}

export default Breadcrumbs;
