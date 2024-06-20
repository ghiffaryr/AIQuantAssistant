const ProductStatusEnum = { 0: 'Unavailable', 1: 'Available' };

export enum EProductStatus {
  Available = 0,
  Unavailable,
}

Object.freeze(ProductStatusEnum);

export default ProductStatusEnum;
