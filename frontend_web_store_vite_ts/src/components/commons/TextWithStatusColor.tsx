/* eslint-disable @typescript-eslint/no-explicit-any */
import SentimentStatus from '@/enums/SentimentEnum';
import SentimentEnum from '@/enums/SentimentEnum';

export default function TextWithStatusColor({
  children,
  status,
  className,
}: TextWithStatusColorProps) {
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

type TextWithStatusColorProps = {
  children?: any;
  status?: SentimentStatus;
  className?: string;
};

TextWithStatusColor.defaultProps = {
  status: '',
  className: '',
};
