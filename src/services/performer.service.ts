import { getGlobalConfig } from 'src/services';
import { APIRequest } from './api-request';

export class PerformerService extends APIRequest {
  create(payload: any) {
    return this.post('/admin/performers', payload);
  }

  update(id: string, payload: any) {
    return this.put(`/admin/performers/${id}`, payload);
  }

  search(query?: { [key: string]: any }) {
    return this.get(this.buildUrl('/admin/performers/search', query));
  }

  findById(id: string) {
    return this.get(`/admin/performers/${id}/view`);
  }

  getUploadDocumentUrl() {
    return `${getGlobalConfig().NEXT_PUBLIC_API_ENDPOINT}/admin/performers/documents/upload`;
  }

  getAvatarUploadUrl() {
    return `${getGlobalConfig().NEXT_PUBLIC_API_ENDPOINT}/admin/performers/avatar/upload`;
  }

  getCoverUploadUrl() {
    return `${getGlobalConfig().NEXT_PUBLIC_API_ENDPOINT}/admin/performers/cover/upload`;
  }

  updatePaymentGatewaySetting(id: string, payload: any) {
    return this.put(`/admin/performers/${id}/payment-gateway-settings`, payload);
  }

  updateCommissionSetting(id: string, payload: any) {
    return this.put(`/admin/performers/${id}/commission-settings`, payload);
  }

  updateBankingSetting(id: string, payload: any) {
    return this.put(`/admin/performers/${id}/banking-settings`, payload);
  }
}

export const performerService = new PerformerService();
