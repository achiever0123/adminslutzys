import { IPaymentSearch } from 'src/interfaces';
import { APIRequest } from './api-request';

export class PaymentService extends APIRequest {
  search(query: IPaymentSearch) {
    return this.get(this.buildUrl('/transactions/admin/search', query as any));
  }
}

export const paymentService = new PaymentService();
