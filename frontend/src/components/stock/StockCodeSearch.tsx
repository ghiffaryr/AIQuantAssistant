import useBoundStore from '@/store/store';
import React, { useState } from 'react';
import { Form, Toast, ToastContainer } from 'react-bootstrap';

export default function StockCodeSearch({ className }: StockCodeSearchProps) {
  const [value, setValue] = useState<string>('');
  const [showToast, setShowToast] = useState(false);

  const stockCode = useBoundStore.use.stockCode();
  const setStockCode = useBoundStore.use.setStockCode();

  const onEnterKeyDown: React.KeyboardEventHandler<HTMLInputElement> = e => {
    if (e.key != 'Enter') {
      return;
    }
    setStockCode(e.currentTarget.value);
  };

  return (
    <>
      <Form.Control
        type="text"
        placeholder="Search code..."
        className={className}
        value={value}
        onKeyDown={onEnterKeyDown}
        onChange={e => setValue(e.currentTarget.value)}
      />
      <ToastContainer className="position-fixed p-3 top-0 end-0">
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
        >
          <Toast.Header className="bg-success">
            <img
              src="holder.js/20x20?text=%20"
              className="rounded me-2"
              alt=""
            />
            <strong className="me-auto text-light">Success</strong>
          </Toast.Header>
          <Toast.Body>{`Stock Code ${stockCode} is implemented`}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}

type StockCodeSearchProps = {
  className?: string;
};
