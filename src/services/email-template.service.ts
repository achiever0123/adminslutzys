import { APIRequest } from './api-request';

export class EmailTemplateService extends APIRequest {
  findAll(query: any) {
    return this.get(this.buildUrl('/mailer/templates', query));
  }

  findById(id: string) {
    return this.get(`/mailer/templates/${id}`);
  }

  update(id: string, payload) {
    return this.put(`/mailer/templates/${id}`, payload);
  }
}

export const emailTemplateService = new EmailTemplateService();
