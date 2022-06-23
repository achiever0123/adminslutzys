// import { IGalleryCreate } from 'src/interfaces';
import { APIRequest } from './api-request';

export class OrderService extends APIRequest {
  search(payload) {
    return this.get(this.buildUrl('/orders/search', payload));
  }

  detailsSearch(payload) {
    return this.get(this.buildUrl('/orders/details/search', payload));
  }

  findById(id) {
    return this.get(`/orders/${id}`);
  }

  findDetailsById(id) {
    return this.get(`/orders/details/${id}`);
  }

  update(id, data) {
    return this.put(`/orders/${id}/update`, data);
  }
}

export const orderService = new OrderService();
