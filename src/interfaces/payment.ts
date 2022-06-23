import { ISearch } from './utils';

export interface IProductPayment {
  name?: string;
  description?: string;
  price?: number;
  productId?: string;
  productType?: string;
}

export interface IPayment {
  _id: string;
  products: IProductPayment[];
  paymentGateway?: string;
  source?: string;
  sourceId?: string;
  target?: string;
  targetId?: string;
  type?: string;
  status?: string;
}

export interface IPaymentSearch extends ISearch {
  type?: string;
  sourceId?: string;
}

export interface IOrder {
  _id: string;
  transactionId: string;
  performerId: string;
  performerInfo?: any;
  userId: string;
  userInfo?: any;
  orderNumber: string;
  shippingCode: string;
  productIds: string[];
  productsInfo: any[];
  quantity: number;
  totalPrice: number;
  deliveryAddress?: string;
  deliveryStatus: string;
  postalCode?: string;
  createdAt: Date;
  updatedAt: Date;
}
