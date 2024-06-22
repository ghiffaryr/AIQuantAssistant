/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from 'react';
import NavbarComponent from '@/components/commons/NavbarComponent';
import Form from 'react-bootstrap/Form';
import Toast from 'react-bootstrap/Toast';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { storage } from '@/utils/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { BsQuestionCircleFill } from 'react-icons/bs';
import Button from 'react-bootstrap/esm/Button';
import { useEffect } from 'react';
import Breadcrumbs from '@/components/commons/Breadcrumbs';
import FooterComponent from '@/components/commons/FooterComponent';
import ToastContainer from 'react-bootstrap/esm/ToastContainer';
import { useNavigate } from 'react-router-dom';
import '@/style/pages/main/ProfilePage.css';
import useServerCart from '@/hooks/useServerCart';
import {
  useDeactivateProfile,
  useGetProfile,
  useUpdateProfile,
} from '@/api/auth';
import errorHandler from '@/utils/error';
import { MappedType } from '@/utils/type';
import useBoundStore from '@/store/store';

export default function ProfilePage() {
  const [inputs, setInputs] = useState<MappedType<string, any>>({
    image: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    coPassword: '',
    phone: '',
    address: '',
    gender: null,
    birthdate: '',
    role: 'ROLE_CUSTOMER',
  });
  const [showGetProfileToast, setShowGetProfileToast] = useState(false);
  const [errorGetProfile, setErrorGetProfile] = useState<any>({});
  const [showUploadProfilePictureToast, setShowUploadProfilePictureToast] =
    useState(false);
  const [errorUploadProfilePicture, setErrorUploadProfilePicture] =
    useState<any>({});
  const [showUpdateProfileToast, setShowUpdateProfileToast] = useState(false);
  const [errorUpdateProfile, setErrorUpdateProfile] = useState<any>({});
  const [validated, setValidated] = useState(false);
  const [showDeactivateAccountToast, setShowDeactivateAccountToast] =
    useState(false);
  const [errorDeactivateAccount, setErrorDeactivateAccount] = useState<any>({});
  const navigate = useNavigate();

  const {
    cartOrderDetailCount,
    errorGetServerCart,
    setShowGetServerCartToast,
    showGetServerCartToast,
  } = useServerCart();

  const {
    data: profileData,
    error: profileError,
    isError: profileIsError,
    isSuccess: profileIsSuccess,
  } = useGetProfile({ enabled: true });

  const removeUserData = useBoundStore.use.removeUserData();

  useEffect(() => {
    if (profileIsSuccess) {
      setInputs({
        ...inputs,
        image: profileData.data.image!,
        firstName: profileData.data.name!.split(' ')[0],
        lastName: profileData.data.name!.split(' ')[1],
        email: profileData.data.email!,
        phone: profileData.data.phone!,
        address: profileData.data.address!,
        gender: profileData.data.gender,
        birthdate: profileData.data.birthdate!,
        role: profileData.data.role!,
      });
      setErrorGetProfile({});
      setShowGetProfileToast(true);
    }

    if (profileIsError) {
      errorHandler({
        error: profileError,
        axiosErrorHandlerFn: err => {
          setErrorGetProfile(err);
          setShowGetProfileToast(true);
        },
        generalErrorHandlerFn: err => {
          setErrorGetProfile({ message: err.message });
          setShowGetProfileToast(true);
        },
      });
    }
  }, [profileData, profileError, profileIsError, profileIsSuccess]);

  const profileUpdate = useUpdateProfile({
    successSideEffect: () => {
      setErrorUpdateProfile({});
      setShowUpdateProfileToast(true);
    },
    onError: error => {
      setInputs({
        ...inputs,
        password: '',
        coPassword: '',
      });

      errorHandler({
        error,
        axiosErrorHandlerFn: err => {
          setErrorUpdateProfile(err);
          setShowUpdateProfileToast(true);
        },
        generalErrorHandlerFn: err => {
          setErrorUpdateProfile(err);
          setShowUpdateProfileToast(true);
        },
      });
    },
  });

  const deactivateProfile = useDeactivateProfile({
    onSuccess: () => {
      removeUserData();
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      setErrorDeactivateAccount({});
      setShowDeactivateAccountToast(true);
    },
    onError: error => {
      errorHandler({
        error,
        axiosErrorHandlerFn: err => {
          setErrorDeactivateAccount(err);
          setShowDeactivateAccountToast(true);
        },
        generalErrorHandlerFn: err => {
          setErrorDeactivateAccount(err);
          setShowDeactivateAccountToast(true);
        },
      });
    },
  });

  function handleChange(e: any) {
    setInputs({
      ...inputs,
      [e.target.name]:
        e.target.name === 'gender' && e.target.value === 'male'
          ? true
          : e.target.name === 'gender' && e.target.value === 'female'
            ? false
            : e.target.value,
    });
  }

  const handleSubmitUpdateProfile = (e: any) => {
    const form = e.currentTarget;

    setValidated(true);
    e.preventDefault();
    if (form.checkValidity()) {
      profileUpdate.mutate(inputs);
    }
  };

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
          image: downloadURL,
        });
      })
      .catch(() => {
        setErrorUploadProfilePicture({ code: 500, message: 'Upload failed!' });
        setShowUploadProfilePictureToast(true);
      });
  }

  const handleDeactivateAccount = () => {
    deactivateProfile.mutate();
  };

  return (
    <>
      <NavbarComponent cartOrderDetailCount={cartOrderDetailCount} />
      <>
        <Breadcrumbs />
        <div className="container mb-3">
          <div
            className="row g-5 d-flex align-items-center justify-content-center"
            id="profile-row"
          >
            <div className="col col-12 col-md-5 col-lg-4 d-flex align-items-center justify-content-center">
              <img
                className="img-fluid rounded-5"
                src={
                  inputs.image
                    ? inputs.image
                    : 'https://firebasestorage.googleapis.com/v0/b/ai-quant-assistant.appspot.com/o/profile_image_notfound.png?alt=media&token=e1488150-c31b-4020-9ca5-b8694f6c72b3'
                }
                alt="Profile"
              />
            </div>
            <div className="col col-12 col-md-7 col-lg-8">
              <Form
                className="profile-form"
                noValidate
                validated={validated}
                onSubmit={handleSubmitUpdateProfile}
              >
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="validationCustom01"
                >
                  <Form.Label column sm="4">
                    Profile Picture Link
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      name="image"
                      type="text"
                      onChange={handleChange}
                      value={inputs.image}
                      placeholder="Profile Picture Link"
                      aria-label="Profile Picture Link"
                      aria-describedby="basic-addon1"
                    />
                  </Col>
                </Form.Group>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="validationCustom02"
                >
                  <Form.Label column sm="4">
                    Upload Profile Picture
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={upload}
                      placeholder="Upload Profile Picture"
                      aria-label="Upload Profile Picture"
                      aria-describedby="basic-addon1"
                    />
                  </Col>
                </Form.Group>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="validationCustom03"
                >
                  <Form.Label column sm="4">
                    <div className="d-inline-flex">
                      First Name&nbsp;<span className="text-danger">*</span>
                    </div>
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      aria-label="First Name"
                      value={inputs.firstName}
                      onChange={handleChange}
                      pattern="^[A-Za-z]{1,30}"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide a valid first name.
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="validationCustom04"
                >
                  <Form.Label column sm="4">
                    Last Name&nbsp;<span className="text-danger">*</span>
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      aria-label="Last Name"
                      value={inputs.lastName}
                      onChange={handleChange}
                      pattern="^[A-Za-z]{1,30}"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide a valid last name.
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="validationCustom05"
                >
                  <Form.Label column sm="4">
                    Email Address&nbsp;<span className="text-danger">*</span>
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      type="email"
                      placeholder="Email Address"
                      aria-label="Email Address"
                      name="email"
                      value={inputs.email}
                      onChange={handleChange}
                      pattern="([a-zA-Z0-9]+(?:[._+-][a-zA-Z0-9]+)*)@([a-zA-Z0-9]+(?:[.-][a-zA-Z0-9]+)*[.][a-zA-Z]{2,})"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide a valid email address.
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="validationCustom06"
                >
                  <Form.Label column sm="4">
                    <div className="d-inline-flex">
                      Password&nbsp;<span className="text-danger">*</span>
                      &nbsp;
                      <span className="d-flex align-items-center">
                        <OverlayTrigger
                          placement={'top'}
                          overlay={
                            <Tooltip id={'tooltip-top'}>
                              <p style={{ textAlign: 'left' }}>
                                The password needs to:{' '}
                              </p>
                              <ul className="tw-list-disc">
                                <li style={{ textAlign: 'left' }}>
                                  include both lower and upper case characters
                                </li>
                                <li style={{ textAlign: 'left' }}>
                                  include at least one number and one special
                                  character
                                </li>
                                <li style={{ textAlign: 'left' }}>
                                  be at least 8 characters long.
                                </li>
                              </ul>
                            </Tooltip>
                          }
                        >
                          <div
                            className="input d-flex align-items-center tw-cursor-pointer"
                            style={{
                              borderRadius: '50%',
                              width: '1rem',
                              height: '1rem',
                            }}
                          >
                            <BsQuestionCircleFill />
                          </div>
                        </OverlayTrigger>
                      </span>
                    </div>
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="Password"
                      aria-label="Password"
                      value={inputs.password}
                      onChange={handleChange}
                      pattern="^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^A-Za-z0-9]).{8,}$"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      <p>
                        Please provide a valid password. The password needs to:{' '}
                      </p>
                      <ul>
                        <li>include both lower and upper case characters</li>
                        <li>
                          include at least one number and one special character
                        </li>
                        <li>be at least 8 characters long.</li>
                      </ul>
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="validationCustom07"
                >
                  <Form.Label column sm="4">
                    Confirm Password <span className="text-danger">*</span>
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      type="password"
                      name="coPassword"
                      placeholder="Confirm Password"
                      aria-label="Confirm Password"
                      value={inputs.coPassword}
                      onChange={handleChange}
                      pattern={inputs.password}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Passwords don't match.
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="validationCustom08"
                >
                  <Form.Label column sm="4">
                    Phone
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      type="text"
                      name="phone"
                      placeholder="Phone"
                      aria-label="Phone"
                      value={inputs.phone}
                      onChange={handleChange}
                      pattern="^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$"
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide a valid phone number.
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="validationCustom09"
                >
                  <Form.Label column sm="4">
                    Address
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      type="text"
                      name="address"
                      placeholder="Address"
                      aria-label="Address"
                      value={inputs.address}
                      onChange={handleChange}
                      pattern="^(?!\s*$).+"
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide a valid address.
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="validationCustom10"
                >
                  <Form.Label column sm="4">
                    Gender
                  </Form.Label>
                  <Col sm="8" className="d-flex align-items-center">
                    <Form.Check
                      inline
                      label="Male"
                      name="gender"
                      value="male"
                      type={'radio'}
                      id="inline-radio-gender-male"
                      onChange={handleChange}
                      checked={inputs.gender === true}
                    />
                    <Form.Check
                      inline
                      label="Female"
                      name="gender"
                      value="female"
                      type={'radio'}
                      id="inline-radio-gender-female"
                      onChange={handleChange}
                      checked={inputs.gender === false}
                    />
                  </Col>
                </Form.Group>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="validationCustom11"
                >
                  <Form.Label column sm="4">
                    Birth Date
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      type="date"
                      name="birthdate"
                      placeholder="Birth Date"
                      aria-label="Birth Date"
                      onChange={handleChange}
                      value={
                        inputs.birthdate && inputs.birthdate.substring(0, 10)
                      }
                    />
                  </Col>
                </Form.Group>
                <div className="text-center">
                  <Button
                    type="submit"
                    variant="outline-primary"
                    className="w-50 mt-3"
                  >
                    Update
                  </Button>
                  <Row>
                    <Col xs={12}>
                      <Form.Text>
                        Deactivate your account?{' '}
                        <a
                          className="deactivate-link text-danger"
                          onClick={handleDeactivateAccount}
                        >
                          <span>Deactivate</span>
                        </a>
                      </Form.Text>
                    </Col>
                  </Row>
                </div>
              </Form>
            </div>
          </div>
        </div>
        <FooterComponent />
      </>
      <ToastContainer className="position-fixed p-3 top-0 end-0">
        {Object.keys(errorGetServerCart).length > 0 && (
          <Toast
            onClose={() => setShowGetServerCartToast(false)}
            show={showGetServerCartToast}
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
            <Toast.Body>{errorGetServerCart.message}</Toast.Body>
          </Toast>
        )}
      </ToastContainer>
      <ToastContainer className="position-fixed p-3 top-0 end-0">
        {Object.keys(errorGetProfile).length > 0 && (
          <Toast
            onClose={() => setShowGetProfileToast(false)}
            show={showGetProfileToast}
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
            <Toast.Body>{errorGetProfile.message}</Toast.Body>
          </Toast>
        )}
      </ToastContainer>
      <ToastContainer className="position-fixed p-3 top-0 end-0">
        {Object.keys(errorUploadProfilePicture).length > 0 && (
          <Toast
            onClose={() => setShowUploadProfilePictureToast(false)}
            show={showUploadProfilePictureToast}
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
            <Toast.Body>{errorUploadProfilePicture.message}</Toast.Body>
          </Toast>
        )}
      </ToastContainer>
      <ToastContainer className="position-fixed p-3 top-0 end-0">
        {Object.keys(errorUpdateProfile).length > 0 ? (
          <Toast
            onClose={() => setShowUpdateProfileToast(false)}
            show={showUpdateProfileToast}
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
            <Toast.Body>{errorUpdateProfile.message}</Toast.Body>
          </Toast>
        ) : (
          <Toast
            onClose={() => setShowUpdateProfileToast(false)}
            show={showUpdateProfileToast}
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
            <Toast.Body>Update profile success!</Toast.Body>
          </Toast>
        )}
      </ToastContainer>
      <ToastContainer className="position-fixed p-3 top-0 end-0">
        {Object.keys(errorDeactivateAccount).length > 0 ? (
          <Toast
            onClose={() => setShowDeactivateAccountToast(false)}
            show={showDeactivateAccountToast}
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
            <Toast.Body>{errorDeactivateAccount.message}</Toast.Body>
          </Toast>
        ) : (
          <Toast
            onClose={() => setShowDeactivateAccountToast(false)}
            show={showDeactivateAccountToast}
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
            <Toast.Body>Deactivate account success!</Toast.Body>
          </Toast>
        )}
      </ToastContainer>
    </>
  );
}
