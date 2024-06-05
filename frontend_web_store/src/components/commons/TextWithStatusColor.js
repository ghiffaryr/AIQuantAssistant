import SentimentEnum from '../../enums/SentimentEnum';

export default function TextWithStatusColor({ children, status, className }) {
  let textColor = '';
  switch (status) {
    case SentimentEnum.NEGATIVE:
      textColor = 'text-danger';
      break;
    case SentimentEnum.POSITIVE:
      textColor = 'text-success';
      break;
    default:
      textColor = 'text-dark';
      break;
  }

  return <p className={`${textColor} ${className}`}>{children}</p>;
}

TextWithStatusColor.defaultProps = {
  value: '',
  status: '',
  className: '',
};
