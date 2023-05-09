import React from "react";
import Button from "react-bootstrap/esm/Button";
import { LinkContainer } from "react-router-bootstrap";

export default function Category({
  id,
  code,
  name,
  description,
  image,
  createTime,
  updateTime,
}) {
  return (
    <>
      <div className="col">
        <div className="card">
          <img
            src={
              image
                ? image
                : "https://firebasestorage.googleapis.com/v0/b/ai-quant-assistant.appspot.com/o/product_image_notfound.jpg?alt=media&token=9b66da8d-37b7-4f30-bbc2-1338d7e2f52c"
            }
            className="card-img-top"
            alt="Category Image"
            height={250}
            overflow="hidden"
          />
          <div className="card-body d-flex flex-column justify-content-between">
            <div className="card-description">
              <h5 className="card-title">{name}</h5>
              <h6 className="card-subtitle mb-2 text-muted">{code}</h6>
              <p className="card-text">{description}</p>
            </div>
            <div className="card-form align-self-center mt-3">
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
