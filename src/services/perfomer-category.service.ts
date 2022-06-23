import {
  IPerformerCategoryCreate,
  IPerformerCategoryUpdate,
  IPerformerCategorySearch
} from 'src/interfaces';
import { APIRequest } from './api-request';

export class PerformerCategoryService extends APIRequest {
  create(payload: IPerformerCategoryCreate) {
    return this.post('/admin/performer-categories', payload);
  }

  search(query: IPerformerCategorySearch) {
    return this.get(
      this.buildUrl('/admin/performer-categories/search', query as any)
    );
  }

  findById(id: string) {
    return this.get(`/admin/performer-categories/${id}/view`);
  }

  update(id: string, payload: IPerformerCategoryUpdate) {
    return this.put(`/admin/performer-categories/${id}`, payload);
  }

  delete(id: string) {
    return this.del(`/admin/performer-categories/${id}`);
  }
}

export const performerCategoryService = new PerformerCategoryService();
