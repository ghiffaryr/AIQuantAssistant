import React, { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import { LinkContainer } from "react-router-bootstrap";

export default function Subscription({
  id,
  code,
  name,
  description,
  image,
  createTime,
  updateTime,
  getSubscriptions,
  setSubscriptions,
}) {
  const [productCategory, setProductCategory] = useState({
    productCategoryId: null,
    productCategoryCode: "",
    productCategoryName: "",
    productCategoryDescription: "",
    productCategoryImage: "",
    createTime: "",
    updateTime: "",
  });
  return (
    <>
      <div className="col">
        <div className="card h-100">
          <img
            src={image}
            className="card-img-top"
            alt="Category Image"
            height={250}
            overflow="hidden"
          />
          <div className="card-body d-flex flex-column justify-content-between">
            <div className="card-content">
              <h5 className="card-title">{name}</h5>
              <h6 className="card-subtitle mb-2 text-muted">{code}</h6>
              <p className="card-text">{description}</p>
            </div>
            <div className="card-button align-self-center mt-3">
              <LinkContainer to={"/category/" + code}>
                <Button variant="outline-primary">View Products</Button>
              </LinkContainer>
            </div>
          </div>
          <div className="card-footer">
            <small className="text-muted">
              Updated at {new Date(updateTime).toString()}
            </small>
          </div>
        </div>
      </div>
    </>
  );
}
