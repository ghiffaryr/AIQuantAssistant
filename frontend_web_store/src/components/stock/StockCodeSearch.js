import { Form } from "react-bootstrap";

export default function StockCodeSearch() {
    return (
       <>
            <Form.Control
                type="text"
                placeholder="Search code..."
                style={{ width: '200px' }}
            />
       </>
    )
}