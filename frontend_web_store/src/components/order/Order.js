import React from "react";
import OrderStatusEnum from "../../enums/OrderStatusEnum";

export default function Order({
  orderId,
  orderDetails,
  userEmail,
  orderAmount,
  orderStatus,
  createTime,
  updateTime,
  getOrders,
  setOrders,
}) {
  return (
    <>
      <div className="col">
        <div className="card h-100">
          <div className="card-body d-flex flex-column justify-content-between">
            <div className="card-content">
              <h5 className="card-title">Order ID {orderId}</h5>
              <h6 className="card-subtitle mb-2 text-muted">
                {OrderStatusEnum[orderStatus]}
              </h6>
              <p className="card-text">Total ${orderAmount}</p>
            </div>
          </div>
          <div className="card-footer">
            <small className="text-muted">
              Created at {new Date(createTime).toString()}
            </small>
          </div>
        </div>
      </div>
    </>
  );
}
