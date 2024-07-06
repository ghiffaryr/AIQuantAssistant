import { Card } from 'react-bootstrap';
import '@/style/components/commons/HeadlineCard.css';
import SentimentEnum from '@/enums/SentimentEnum';
import TextWithStatusColor from './TextWithStatusColor';
import { Spoiler } from '@mantine/core';

export default function HeadlineCard({
  className,
  title,
  elapsedTime,
  content,
  status,
}: HeadlineCardProps) {
  return (
    <Card
      key="light"
      text="dark"
      className={`shadow rounded gradient-card-bg-${status} ${className}`}>
      <Card.Body>
        <div className={`d-flex fs-3 fw-bold align-items-center`}>
          <TextWithStatusColor status={status} className="flex-grow-1">
            {title}
          </TextWithStatusColor>
          <TextWithStatusColor status={status} className="fs-5">
            {`(${elapsedTime} Hour Ago)`}
          </TextWithStatusColor>
        </div>{' '}
        <Spoiler maxHeight={120} showLabel="Show more" hideLabel="Hide">
          <p>{content}</p>
        </Spoiler>
      </Card.Body>
    </Card>
  );
}

type HeadlineCardProps = {
  className?: string;
  title: string;
  elapsedTime?: number;
  content: string;
  status: SentimentEnum;
};

HeadlineCard.defaultProps = {
  className: '',
  title: '',
  elapsedTime: 0,
  content: '',
  status: '',
};
