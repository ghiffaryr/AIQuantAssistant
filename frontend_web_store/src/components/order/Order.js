import axios from "axios";
import React, { useState } from "react";
import Toast from "react-bootstrap/Toast";
import Button from "react-bootstrap/esm/Button";
import ToastContainer from "react-bootstrap/esm/ToastContainer";
import OrderStatusEnum from "../../enums/OrderStatusEnum";
import { API } from "../../env/Constants";
import OrderOrderDetailList from "./OrderOrderDetailList";

export default function Order({
  orderId,
  orderDetails,
  userEmail,
  orderAmount,
  orderStatus,
  createTime,
  updateTime,
  orders,
  getOrders,
  setOrders,
}) {
  const [showCancelOrderToast, setShowCancelOrderToast] = useState(false);
  const [errorCancelOrder, setErrorCancelOrder] = useState({});
  const [showFinishOrderToast, setShowFinishOrderToast] = useState(false);
  const [errorFinishOrder, setErrorFinishOrder] = useState({});
  const handleCancelOrder = async (orderId) => {
    try {
      axios.defaults.headers.common = {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        "Access-Control-Allow-Origin": "*",
      };
      let { status, data } = await axios.patch(
        `${API}/order/cancel/${orderId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      let newOrders = orders;
      for (let order of newOrders) {
        if (order.orderId === orderId) {
          order.orderStatus = 2;
        }
      }
      setOrders(newOrders);
      getOrders();
      setErrorCancelOrder({});
      setShowCancelOrderToast(true);
    } catch (error) {
      for (let errorObject of error.response.data.errors) {
        setErrorCancelOrder(errorObject);
        setShowCancelOrderToast(true);
      }
    }
  };
  const handleFinishOrder = async (orderId) => {
    try {
      axios.defaults.headers.common = {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        "Access-Control-Allow-Origin": "*",
      };
      let { status, data } = await axios.patch(
        `${API}/order/finish/${orderId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      let newOrders = orders;
      for (let order of newOrders) {
        if (order.orderId === orderId) {
          order.orderStatus = 1;
        }
      }
      setOrders(newOrders);
      getOrders();
      setErrorFinishOrder({});
      setShowFinishOrderToast(true);
    } catch (error) {
      for (let errorObject of error.response.data.errors) {
        setErrorFinishOrder(errorObject);
        setShowFinishOrderToast(true);
      }
    }
  };
  return (
    <>
      <div className="col">
        <div className="card h-100">
          <div className="card-body d-flex flex-column justify-content-between">
            <div className="card-content">
              <div className="row row-cols-2">
                <div className="col">
                  <h5 className="card-title">Order ID {orderId}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                    {OrderStatusEnum[orderStatus]}
                  </h6>
                  <p className="card-text">Total ${orderAmount}</p>
                </div>
                <div className="col">
                  <div className="d-flex justify-content-end">
                    {orderStatus === 0 && (
                      <div className="ms-4">
                        <Button
                          variant="outline-danger"
                          onClick={() => handleCancelOrder(orderId)}
                        >
                          Cancel Order
                        </Button>
                      </div>
                    )}
                    {(localStorage.getItem("userRole") === "ROLE_EMPLOYEE" ||
                      localStorage.getItem("userRole") === "ROLE_MANAGER") && (
                      <div className="ms-4">
                        <Button
                          variant="outline-success"
                          onClick={() => handleFinishOrder(orderId)}
                        >
                          Finish Order
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <OrderOrderDetailList orderOrderDetails={orderDetails} />
            </div>
          </div>
          <div className="card-footer">
            <small className="text-muted">
              Created at {new Date(createTime).toString()}
            </small>
          </div>
        </div>
      </div>
      <ToastContainer className="p-3 top-0 end-0">
        <Toast
          onClose={() => setShowCancelOrderToast(false)}
          show={showCancelOrderToast}
          delay={3000}
          autohide
        >
          {Object.keys(errorCancelOrder).length > 0 ? (
            <>
              <Toast.Header className="bg-danger">
                <img
                  src="holder.js/20x20?text=%20"
                  className="rounded me-2"
                  alt=""
                />
                <strong className="me-auto text-light">Error</strong>
              </Toast.Header>
              <Toast.Body>{errorCancelOrder.message}</Toast.Body>
            </>
          ) : (
            <>
              <Toast.Header className="bg-success">
                <img
                  src="holder.js/20x20?text=%20"
                  className="rounded me-2"
                  alt=""
                />
                <strong className="me-auto text-light">Success</strong>
              </Toast.Header>
              <Toast.Body>Cancel order success!</Toast.Body>
            </>
          )}
        </Toast>
      </ToastContainer>
      <ToastContainer className="p-3 top-0 end-0">
        <Toast
          onClose={() => setShowFinishOrderToast(false)}
          show={showFinishOrderToast}
          delay={3000}
          autohide
        >
          {Object.keys(errorFinishOrder).length > 0 ? (
            <>
              <Toast.Header className="bg-danger">
                <img
                  src="holder.js/20x20?text=%20"
                  className="rounded me-2"
                  alt=""
                />
                <strong className="me-auto text-light">Error</strong>
              </Toast.Header>
              <Toast.Body>{errorFinishOrder.message}</Toast.Body>
            </>
          ) : (
            <>
              <Toast.Header className="bg-success">
                <img
                  src="holder.js/20x20?text=%20"
                  className="rounded me-2"
                  alt=""
                />
                <strong className="me-auto text-light">Success</strong>
              </Toast.Header>
              <Toast.Body>Finish order success!</Toast.Body>
            </>
          )}
        </Toast>
      </ToastContainer>
    </>
  );
}
