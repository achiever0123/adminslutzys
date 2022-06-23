import { APIRequest } from './api-request';

export class CouponService extends APIRequest {
  create(payload: any) {
    return this.post('/coupons/admin', payload);
  }

  search(query?: { [key: string]: any }) {
    return this.get(this.buildUrl('/coupons/admin/search', query));
  }

  findByIdOrCode(id: string) {
    return this.get(`/coupons/admin/${id}/view`);
  }

  update(id: string, payload: any) {
    return this.put(`/coupons/admin/${id}`, payload);
  }

  delete(id: string) {
    return this.del(`/coupons/admin/${id}`);
  }
}

export const couponService = new CouponService();
