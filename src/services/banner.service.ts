import { APIRequest } from './api-request';

export class BannerService extends APIRequest {
  uploadBanner(file: File, payload: any, onProgress?: Function) {
    return this.upload(
      '/admin/site-promo/upload',
      [
        {
          fieldname: 'banner',
          file
        }
      ],
      {
        onProgress,
        customData: payload
      }
    );
  }

  search(query?: { [key: string]: any }) {
    return this.get(this.buildUrl('/admin/site-promo/search', query));
  }

  findById(id: string) {
    return this.get(`/admin/site-promo/${id}/view`);
  }

  update(id: string, payload: any) {
    return this.put(`/admin/site-promo/${id}`, payload);
  }

  delete(id: string) {
    return this.del(`/admin/site-promo/${id}`);
  }
}

export const bannerService = new BannerService();
