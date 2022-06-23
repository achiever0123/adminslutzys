import { ISearch } from './utils';

export interface IEaring {
  _id?: string;
  userId: string;
  userInfo?: any;
  transactionId: string;
  transactionInfo?: any;
  performerId: string;
  performerInfo?: any;
  sourceType: string;
  grossPrice: number;
  netPrice: number;
  commission: number;
  isPaid: boolean;
  createdAt: Date;
  paidAt: Date;
}

export interface IEarningSearch extends ISearch {
  fromDate?: Date;
  toDate?: Date;
  performerId?: string;
}

export interface IUpdatePaidStatus {
  fromDate: Date;
  toDate: Date;
  performerId: string;
}
