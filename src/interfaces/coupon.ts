import { ISearch } from './utils';

export interface ICoupon {
  name: string;
  description: string;
  code: string;
  value: number;
  expiredDate: string | Date;
  status: string;
  updatedAt: Date;
}

export interface ICouponCreate {
  name: string;
  description: string;
  code: string;
  value: number;
  expiredDate: string | Date;
  status: string;
}

export interface ICouponUpdate {
  name: string;
  description: string;
  code: string;
  value: number;
  expiredDate: string | Date;
  status: string;
}

export interface ICouponSearch extends ISearch {
  status: string;
  sort: string;
  sortBy: string;
}
