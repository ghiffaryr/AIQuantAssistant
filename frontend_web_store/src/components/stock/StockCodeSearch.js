import { Form } from 'react-bootstrap';

export default function StockCodeSearch({ className }) {
  return (
    <>
      <Form.Control
        type="text"
        placeholder="Search code..."
        style={{ width: '200px' }}
        className={className}
      />
    </>
  );
}
