/* eslint-disable no-shadow */
export type PaymentAccounnt = 'banking' | 'paypal'
export enum PAYMENT_ACCOUNT {
  BANKING = 'banking',
  PAYPAL = 'paypal',
}
export type PayoutStatus = 'pending' | 'rejected' | 'done';

export interface PayoutRequestInterface {
  _id: string;
  sourceId: string;
  source: string;
  sourceInfo: any;
  paymentAccountType: PaymentAccounnt;
  paymentAccountInfo: any;
  requestNote: string;
  adminNote: string;
  status: PayoutStatus;
  requestedPrice: number;
  fromDate: Date;
  toDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
