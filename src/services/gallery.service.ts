import { APIRequest } from './api-request';

export class GalleryService extends APIRequest {
  create(payload: any) {
    return this.post('/admin/performer-assets/galleries', payload);
  }

  search(query?: { [key: string]: any }) {
    return this.get(
      this.buildUrl('/admin/performer-assets/galleries/search', query)
    );
  }

  findById(id: string) {
    return this.get(`/admin/performer-assets/galleries/${id}/view`);
  }

  update(id: string, payload: any) {
    return this.put(`/admin/performer-assets/galleries/${id}`, payload);
  }

  delete(id: string) {
    return this.del(`/admin/performer-assets/galleries/${id}`);
  }
}

export const galleryService = new GalleryService();
