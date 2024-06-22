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
import { useCategorySellerUpdate } from '@/api/category';
import { CategoryDetailType } from '@/type/CategoryType';
import errorHandler from '@/utils/error';

const UpdateCategoryModal = ({
  code,
  name,
  description,
  image,
  categories,
  setCategories,
  show,
  onHide,
}: UpdateCategoryModalProps) => {
  const [inputs, setInputs] = useState({
    productCategoryCode: code!,
    productCategoryDescription: description!,
    productCategoryImage: image!,
    productCategoryName: name!,
  });
  const [validated, setValidated] = useState(false);
  const [showUploadImageToast, setShowUploadImageToast] = useState(false);
  const [errorUploadImage, setErrorUploadImage] = useState({});
  const [showUpdateCategoryToast, setShowUpdateCategoryToast] = useState(false);
  const [errorUpdateCategory, setErrorUpdateCategory] = useState({});

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
          productCategoryImage: downloadURL,
        });
      })
      .catch(() => {
        setErrorUploadImage({ code: 500, message: 'Upload failed!' });
        setShowUploadImageToast(true);
      });
  }

  const categorySellerUpdate = useCategorySellerUpdate({
    successSideEffect: res => {
      const { data } = res;
      let newCategories = categories;
      newCategories = (newCategories || []).map(category => {
        if (category.productCategoryCode === code) {
          category.productCategoryCode = data.productCategoryCode;
          category.productCategoryDescription = data.productCategoryDescription;
          category.productCategoryImage = data.productImage;
          category.productCategoryName = data.productName;
          category.updateTime = data.updateTime;
        }
        return category;
      });
      setCategories?.(newCategories);
      setErrorUpdateCategory({});
      setShowUpdateCategoryToast(true);
    },
    onError: error => {
      errorHandler({
        error,
        axiosErrorHandlerFn: err => {
          setErrorUpdateCategory(err);
          setShowUpdateCategoryToast(true);
        },
        generalErrorHandlerFn: err => {
          setErrorUpdateCategory({ message: err.message });
          setShowUpdateCategoryToast(true);
        },
      });
    },
  });

  const handleSubmitUpdateCategory = (e: any) => {
    const form = e.currentTarget;

    setValidated(true);
    e.preventDefault();
    if (form.checkValidity()) {
      categorySellerUpdate.mutate(inputs);
    }
  };

  return (
    <>
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={show}
        onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Update Category
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container d-flex justify-content-center flex-column align-items-center text-left">
            <Form
              onSubmit={handleSubmitUpdateCategory}
              className="update-product-form"
              id="update-product-form"
              noValidate
              validated={validated}>
              <Form.Group
                as={Row}
                className="mb-3"
                controlId="validationCustom01">
                <Form.Label column sm="4">
                  <div className="d-inline-flex">
                    Code&nbsp;<span className="text-danger">*</span>
                  </div>
                </Form.Label>
                <Col sm="8">
                  <Form.Control
                    type="text"
                    name="productCategoryCode"
                    placeholder="Code"
                    aria-label="Code"
                    value={inputs.productCategoryCode}
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
                controlId="validationCustom02">
                <Form.Label column sm="4">
                  <div className="d-inline-flex">
                    Name&nbsp;<span className="text-danger">*</span>
                  </div>
                </Form.Label>
                <Col sm="8">
                  <Form.Control
                    type="text"
                    name="productCategoryName"
                    placeholder="Name"
                    aria-label="Name"
                    value={inputs.productCategoryName}
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
                controlId="validationCustom03">
                <Form.Label column sm="4">
                  Image Link
                </Form.Label>
                <Col sm="8">
                  <Form.Control
                    name="productCategoryImage"
                    type="text"
                    onChange={handleChange}
                    value={inputs.productCategoryImage}
                    placeholder="Image Link"
                    aria-label="Image Link"
                    aria-describedby="basic-addon1"
                  />
                </Col>
              </Form.Group>
              <Form.Group
                as={Row}
                className="mb-3"
                controlId="validationCustom04">
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
                controlId="validationCustom05">
                <Form.Label column sm="4">
                  Description
                </Form.Label>
                <Col sm="8">
                  <Form.Control
                    name="productCategoryDescription"
                    type="text"
                    onChange={handleChange}
                    value={inputs.productCategoryDescription}
                    placeholder="Category Description"
                    aria-label="Category Description"
                    aria-describedby="basic-addon1"
                  />
                </Col>
              </Form.Group>
              <Button
                className="d-none"
                type="submit"
                id="update-form-button"
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
                  (
                    document.getElementById('update-form-button') as HTMLElement
                  ).click()
                }>
                Save changes
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
              autohide>
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
          {Object.keys(errorUpdateCategory).length > 0 ? (
            <Toast
              onClose={() => setShowUpdateCategoryToast(false)}
              show={showUpdateCategoryToast}
              delay={3000}
              autohide>
              <Toast.Header className="bg-danger">
                <img
                  src="holder.js/20x20?text=%20"
                  className="rounded me-2"
                  alt=""
                />
                <strong className="me-auto text-light">Error</strong>
              </Toast.Header>
              <Toast.Body>{(errorUpdateCategory as any).message}</Toast.Body>
            </Toast>
          ) : (
            <Toast
              onClose={() => setShowUpdateCategoryToast(false)}
              show={showUpdateCategoryToast}
              delay={3000}
              autohide>
              <Toast.Header className="bg-success">
                <img
                  src="holder.js/20x20?text=%20"
                  className="rounded me-2"
                  alt=""
                />
                <strong className="me-auto text-light">Success</strong>
              </Toast.Header>
              <Toast.Body>Update category success!</Toast.Body>
            </Toast>
          )}
        </ToastContainer>
      </>
    </>
  );
};

type UpdateCategoryModalProps = {
  id?: number;
  code?: string;
  name?: string;
  description?: string;
  image?: string;
  createTime?: string;
  updateTime?: string;
  categories?: CategoryDetailType[];
  setCategories?: React.Dispatch<React.SetStateAction<CategoryDetailType[]>>;
  show: boolean;
  onHide: () => void;
};

export default UpdateCategoryModal;
