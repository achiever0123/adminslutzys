import { ISetting } from 'src/interfaces';
import { getGlobalConfig } from 'src/services';
import { APIRequest, IResponse } from './api-request';

export class SettingService extends APIRequest {
  public(): Promise<IResponse<ISetting>> {
    return this.get(this.buildUrl('/settings/public'));
  }

  all(group = ''): Promise<IResponse<ISetting>> {
    return this.get(this.buildUrl('/admin/settings', { group }));
  }

  update(key: string, value: any) {
    return this.put(`/admin/settings/${key}`, { value });
  }

  getFileUploadUrl() {
    return `${getGlobalConfig().NEXT_PUBLIC_API_ENDPOINT}/admin/settings/files/upload`;
  }

  verifyMailer() {
    return this.post('/mailer/verify');
  }
}

export const settingService = new SettingService();
