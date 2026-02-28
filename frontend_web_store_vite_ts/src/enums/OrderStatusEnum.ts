import { MappedType } from '@/utils/type';

const OrderStatusEnum: MappedType<number, string> = {
  0: 'New',
  1: 'Finished',
  2: 'Canceled',
};

export enum EOrderStatus {
  'New' = 0,
  'Finished',
  'Canceled',
}

Object.freeze(OrderStatusEnum);

export default OrderStatusEnum;
