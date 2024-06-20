/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Modal } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { storage } from '@/utils/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import ToastContainer from 'react-bootstrap/esm/ToastContainer';
import Toast from 'react-bootstrap/Toast';
import { useProductSellerCreate } from '@/api/product';
import errorHandler from '@/utils/error';

export default function CreateProductModal({
  show,
  onHide,
}: CreateProductModalProps) {
  const [inputs, setInputs] = useState({
    productCategoryCode: '',
    productCode: '',
    productDescription: '',
    productImage: '',
    productName: '',
    productPeriod: 0,
    productPrice: 0,
    productStatus: 0,
  });
  const [validated, setValidated] = useState(false);
  const [showUploadImageToast, setShowUploadImageToast] = useState(false);
  const [errorUploadImage, setErrorUploadImage] = useState({});
  const [showCreateProductToast, setShowCreateProductToast] = useState(false);
  const [errorCreateProduct, setErrorCreateProduct] = useState({});

  const productSellerCreate = useProductSellerCreate({
    successSideEffect: () => {
      setErrorCreateProduct({});
      setShowCreateProductToast(true);
    },
    onError: error => {
      errorHandler({
        error,
        axiosErrorHandlerFn: err => {
          setErrorCreateProduct(err);
          setShowCreateProductToast(true);
        },
        generalErrorHandlerFn: err => {
          setErrorCreateProduct({ message: err.message });
          setShowCreateProductToast(true);
        },
      });
    },
  });

  function handleChange(e: any) {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  }

  function upload(e: any) {
    e.preventDefault();
    const fileName = e.target.files[0].name;
    const storageRef = ref(storage, `${fileName}`);
    uploadBytes(storageRef, e.target.files[0])
      .then(() => {
        return getDownloadURL(storageRef);
      })
      .then(downloadURL => {
        setInputs({
          ...inputs,
          productImage: downloadURL,
        });
      })
      .catch(() => {
        setErrorUploadImage({ code: 500, message: 'Upload failed!' });
        setShowUploadImageToast(true);
      });
  }

  const handleSubmitCreateProduct = (e: any) => {
    const form = e.currentTarget;

    setValidated(true);
    e.preventDefault();
    if (form.checkValidity()) {
      productSellerCreate.mutate(inputs);
    }
  };

  return (
    <>
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={show}
        onHide={onHide}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Create Product
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container d-flex justify-content-center flex-column align-items-center text-left">
            <Form
              onSubmit={handleSubmitCreateProduct}
              className="update-product-form"
              id="update-product-form"
              noValidate
              validated={validated}
            >
              <Form.Group
                as={Row}
                className="mb-3"
                controlId="validationCustom01"
              >
                <Form.Label column sm="4">
                  <div className="d-inline-flex">
                    Category Code&nbsp;<span className="text-danger">*</span>
                  </div>
                </Form.Label>
                <Col sm="8">
                  <Form.Control
                    type="text"
                    name="productCategoryCode"
                    placeholder="Category Code"
                    aria-label="Category Code"
                    value={inputs.productCategoryCode}
                    onChange={handleChange}
                    pattern="^(?!\s*$).+"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Category Code cannot be blank.
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
              <Form.Group
                as={Row}
                className="mb-3"
                controlId="validationCustom02"
              >
                <Form.Label column sm="4">
                  <div className="d-inline-flex">
                    Code&nbsp;<span className="text-danger">*</span>
                  </div>
                </Form.Label>
                <Col sm="8">
                  <Form.Control
                    type="text"
                    name="productCode"
                    placeholder="Code"
                    aria-label="Code"
                    value={inputs.productCode}
                    onChange={handleChange}
                    pattern="^(?!\s*$).+"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Code cannot be blank.
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
              <Form.Group
                as={Row}
                className="mb-3"
                controlId="validationCustom03"
              >
                <Form.Label column sm="4">
                  <div className="d-inline-flex">
                    Name&nbsp;<span className="text-danger">*</span>
                  </div>
                </Form.Label>
                <Col sm="8">
                  <Form.Control
                    type="text"
                    name="productName"
                    placeholder="Name"
                    aria-label="Name"
                    value={inputs.productName}
                    onChange={handleChange}
                    pattern="^(?!\s*$).+"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Name cannot be blank.
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
              <Form.Group
                as={Row}
                className="mb-3"
                controlId="validationCustom04"
              >
                <Form.Label column sm="4">
                  <div className="d-inline-flex">
                    Price&nbsp;<span className="text-danger">*</span>
                  </div>
                </Form.Label>
                <Col sm="8">
                  <Form.Control
                    type="number"
                    name="productPrice"
                    placeholder="Price"
                    aria-label="Price"
                    value={Number(inputs.productPrice)}
                    onChange={handleChange}
                    onWheel={e => (e.target as HTMLElement).blur()}
                    min={0}
                    required
                  />
                </Col>
              </Form.Group>
              <Form.Group
                as={Row}
                className="mb-3"
                controlId="validationCustom05"
              >
                <Form.Label column sm="4">
                  <div className="d-inline-flex">
                    Period&nbsp;<span className="text-danger">*</span>
                  </div>
                </Form.Label>
                <Col sm="8">
                  <Form.Control
                    type="number"
                    name="productPeriod"
                    placeholder="Period (month)"
                    aria-label="Period (month)"
                    value={Number(inputs.productPeriod)}
                    onChange={handleChange}
                    onWheel={e => (e.target as HTMLElement).blur()}
                    min={0}
                    required
                  />
                </Col>
              </Form.Group>
              <Form.Group
                as={Row}
                className="mb-3"
                controlId="validationCustom06"
              >
                <Form.Label column sm="4">
                  Status&nbsp;<span className="text-danger">*</span>
                </Form.Label>
                <Col sm="8" className="d-flex align-items-center">
                  <Form.Check
                    inline
                    label="Available"
                    name="productStatus"
                    value={1}
                    type={'radio'}
                    id="inline-radio-product-status-available"
                    onChange={handleChange}
                    checked={Number(inputs.productStatus) === 1}
                  />
                  <Form.Check
                    inline
                    label="Unavailable"
                    name="productStatus"
                    value={0}
                    type={'radio'}
                    id="inline-radio-product-status-unavailable"
                    onChange={handleChange}
                    checked={Number(inputs.productStatus) === 0}
                  />
                </Col>
              </Form.Group>
              <Form.Group
                as={Row}
                className="mb-3"
                controlId="validationCustom07"
              >
                <Form.Label column sm="4">
                  Image Link
                </Form.Label>
                <Col sm="8">
                  <Form.Control
                    name="productImage"
                    type="text"
                    onChange={handleChange}
                    value={inputs.productImage}
                    placeholder="Image Link"
                    aria-label="Image Link"
                    aria-describedby="basic-addon1"
                  />
                </Col>
              </Form.Group>
              <Form.Group
                as={Row}
                className="mb-3"
                controlId="validationCustom08"
              >
                <Form.Label column sm="4">
                  Upload Image
                </Form.Label>
                <Col sm="8">
                  <Form.Control
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={upload}
                    placeholder="Upload Image"
                    aria-label="Upload Image"
                    aria-describedby="basic-addon1"
                  />
                </Col>
              </Form.Group>
              <Form.Group
                as={Row}
                className="mb-3"
                controlId="validationCustom09"
              >
                <Form.Label column sm="4">
                  Description
                </Form.Label>
                <Col sm="8">
                  <Form.Control
                    name="productDescription"
                    type="text"
                    onChange={handleChange}
                    value={inputs.productDescription}
                    placeholder="Product Description"
                    aria-label="Product Description"
                    aria-describedby="basic-addon1"
                  />
                </Col>
              </Form.Group>
              <Button
                className="d-none"
                type="submit"
                id="create-form-button"
              />
            </Form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="d-flex justify-content-end">
            <div className="me-3">
              <Button
                variant="outline-success"
                onClick={() =>
                  document.getElementById('create-form-button')?.click()
                }
              >
                Create
              </Button>
            </div>
            <Button variant="outline-danger" onClick={onHide}>
              Cancel
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
      <>
        <ToastContainer className="position-fixed p-3 top-0 end-0">
          {Object.keys(errorUploadImage).length > 0 && (
            <Toast
              onClose={() => setShowUploadImageToast(false)}
              show={showUploadImageToast}
              delay={3000}
              autohide
            >
              <Toast.Header className="bg-danger">
                <img
                  src="holder.js/20x20?text=%20"
                  className="rounded me-2"
                  alt=""
                />
                <strong className="me-auto text-light">Error</strong>
              </Toast.Header>
              <Toast.Body>{(errorUploadImage as any).message}</Toast.Body>
            </Toast>
          )}
        </ToastContainer>
        <ToastContainer className="position-fixed p-3 top-0 end-0">
          {Object.keys(errorCreateProduct).length > 0 ? (
            <Toast
              onClose={() => setShowCreateProductToast(false)}
              show={showCreateProductToast}
              delay={3000}
              autohide
            >
              <Toast.Header className="bg-danger">
                <img
                  src="holder.js/20x20?text=%20"
                  className="rounded me-2"
                  alt=""
                />
                <strong className="me-auto text-light">Error</strong>
              </Toast.Header>
              <Toast.Body>{(errorCreateProduct as any).message}</Toast.Body>
            </Toast>
          ) : (
            <Toast
              onClose={() => setShowCreateProductToast(false)}
              show={showCreateProductToast}
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
              <Toast.Body>Create product success!</Toast.Body>
            </Toast>
          )}
        </ToastContainer>
      </>
    </>
  );
}

type CreateProductModalProps = {
  show: boolean;
  onHide: () => void;
};
