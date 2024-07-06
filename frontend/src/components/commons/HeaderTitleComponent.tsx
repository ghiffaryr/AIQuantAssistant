import { Badge } from '@mantine/core';

export default function HeaderTitleComponent({
  title,
  divider,
  stockCode,
}: HeaderTitleComponentProps) {
  return (
    <div className="container py-4">
      <div className="tw-flex tw-flex-row tw-items-center">
        <div className="fs-2 tw-flex-grow">{title}</div>
        {stockCode && (
          <Badge variant="light" color="rgba(0, 0, 0, 1)" size="lg">
            {`Stock code: ${stockCode}`}
          </Badge>
        )}
      </div>
      {divider && <hr />}
    </div>
  );
}

type HeaderTitleComponentProps = {
  title: string;
  divider?: boolean;
  stockCode?: string;
};

HeaderTitleComponent.defaultProps = {
  title: '',
  divider: false,
};
