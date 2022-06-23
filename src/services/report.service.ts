import { APIRequest } from './api-request';

export class ReportService extends APIRequest {
  search(data) {
    return this.get(this.buildUrl('/reports', data));
  }

  deleteContent(id: string) {
    return this.del(`/reports/${id}`);
  }

  rejectReport(id: string) {
    return this.put(`/reports/${id}/reject`);
  }
}

export const reportService = new ReportService();
