import { Form, Modal } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { storage } from "../../env/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { API } from "../../env/Constants";
import axios from "axios";
import { useEffect } from "react";
import ToastContainer from "react-bootstrap/esm/ToastContainer";
import Toast from "react-bootstrap/Toast";

export default function UpdateCategoryModal({
  id,
  code,
  name,
  description,
  image,
  createTime,
  updateTime,
  categories,
  setCategories,
  show,
  onHide,
}) {
  const [inputs, setInputs] = useState({
    productCategoryCode: "",
    productCategoryDescription: "",
    productCategoryImage: "",
    productCategoryName: "",
  });
  const [validated, setValidated] = useState(false);
  const [showUploadImageToast, setShowUploadImageToast] = useState(false);
  const [errorUploadImage, setErrorUploadImage] = useState({});
  const [showUpdateCategoryToast, setShowUpdateCategoryToast] = useState(false);
  const [errorUpdateCategory, setErrorUpdateCategory] = useState({});

  function getCategory() {
    setInputs({
      productCategoryCode: code,
      productCategoryDescription: description,
      productCategoryImage: image,
      productCategoryName: name,
    });
  }

  useEffect(() => {
    getCategory();
  }, []);

  function handleChange(e) {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  }

  function upload(e) {
    e.preventDefault();
    const fileName = e.target.files[0].name;
    const storageRef = ref(storage, `${fileName}`);
    uploadBytes(storageRef, e.target.files[0])
      .then((snapshot) => {
        return getDownloadURL(storageRef);
      })
      .then((downloadURL) => {
        setInputs({
          ...inputs,
          productCategoryImage: downloadURL,
        });
      })
      .catch((err) => {
        setErrorUploadImage({ code: 500, message: "Upload failed!" });
        setShowUploadImageToast(true);
      });
  }

  const handleSubmitUpdateCategory = async (e) => {
    const form = e.currentTarget;

    setValidated(true);
    e.preventDefault();
    if (form.checkValidity()) {
      try {
        axios.defaults.headers.common = {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          "Access-Control-Allow-Origin": "*",
        };
        let { status, data } = await axios.put(
          `${API}/seller/category/${inputs.productCategoryCode}/update`,
          inputs
        );
        let newCategories = categories;
        newCategories = newCategories.map((category) => {
          if (category.productCategoryCode === code) {
            category.productCategoryCode = data.productCategoryCode;
            category.productCategoryDescription =
              data.productCategoryDescription;
            category.productCategoryImage = data.productImage;
            category.productCategoryName = data.productName;
            category.updateTime = data.updateTime;
          }
          return category;
        });
        setCategories(newCategories);
        setErrorUpdateCategory({});
        setShowUpdateCategoryToast(true);
      } catch (error) {
        for (let errorObject of error.response.data.errors) {
          setErrorUpdateCategory(errorObject);
          setShowUpdateCategoryToast(true);
        }
      }
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
              validated={validated}
            >
              <Form.Group
                as={Row}
                className="mb-3"
                controlId="validationCustom01"
              >
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
                controlId="validationCustom02"
              >
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
                controlId="validationCustom03"
              >
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
                controlId="validationCustom04"
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
                controlId="validationCustom05"
              >
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
                  document.getElementById("update-form-button").click()
                }
              >
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
              <Toast.Body>{errorUploadImage.message}</Toast.Body>
            </Toast>
          )}
        </ToastContainer>
        <ToastContainer className="position-fixed p-3 top-0 end-0">
          {Object.keys(errorUpdateCategory).length > 0 ? (
            <Toast
              onClose={() => setShowUpdateCategoryToast(false)}
              show={showUpdateCategoryToast}
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
              <Toast.Body>{errorUpdateCategory.message}</Toast.Body>
            </Toast>
          ) : (
            <Toast
              onClose={() => setShowUpdateCategoryToast(false)}
              show={showUpdateCategoryToast}
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
              <Toast.Body>Update category success!</Toast.Body>
            </Toast>
          )}
        </ToastContainer>
      </>
    </>
  );
}
