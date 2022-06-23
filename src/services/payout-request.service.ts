import { APIRequest } from './api-request';

class PayoutRequestService extends APIRequest {
  calculate(payload: any) {
    return this.post('/payout-requests/amin/calculate', payload);
  }

  stats(payload: { sourceId?: string }) {
    return this.post('/payout-requests/admin/stats', payload);
  }

  search(query: { [key: string]: any }) {
    return this.get(this.buildUrl('/payout-requests/search', query));
  }

  update(id: string, body: any) {
    return this.post(`/payout-requests/admin/status/${id}`, body);
  }

  detail(
    id: string
  ): Promise<any> {
    return this.get(`/payout-requests/admin/${id}`);
  }
}

export const payoutRequestService = new PayoutRequestService();
