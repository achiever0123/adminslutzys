import { IEarningSearch, IUpdatePaidStatus } from 'src/interfaces';
import { APIRequest } from './api-request';

export class EarningService extends APIRequest {
  search(query: IEarningSearch) {
    return this.get(this.buildUrl('/earning/admin/search', query as any));
  }

  stats(query: IEarningSearch) {
    return this.get(this.buildUrl('/earning/admin/stats', query as any));
  }

  updatePaidStatus(data: IUpdatePaidStatus) {
    return this.post('/earning/admin/update-status', data);
  }

  findById(id: string) {
    return this.get(`/earning/${id}`);
  }
}

export const earningService = new EarningService();
