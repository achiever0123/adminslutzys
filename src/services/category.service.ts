import { APIRequest } from './api-request';

export class CategoryService extends APIRequest {
  create(payload: any) {
    return this.post('/admin/categories', payload);
  }

  search(query?: { [key: string]: any }) {
    return this.get(this.buildUrl('/admin/categories/search', query));
  }

  findById(id: string) {
    return this.get(`/admin/categories/${id}`);
  }

  update(id: string, payload: any) {
    return this.put(`/admin/categories/${id}`, payload);
  }

  delete(id: string) {
    return this.del(`/admin/categories/${id}`);
  }
}

export const categoryService = new CategoryService();
