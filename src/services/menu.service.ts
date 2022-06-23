import { APIRequest } from './api-request';

export class MenuService extends APIRequest {
  create(payload: any) {
    return this.post('/menus/admin', payload);
  }

  search(query?: { [key: string]: any }) {
    return this.get(this.buildUrl('/menus/admin/search', query));
  }

  findById(id: string) {
    return this.get(`/menus/admin/${id}/view`);
  }

  update(id: string, payload: any) {
    return this.put(`/menus/admin/${id}`, payload);
  }

  delete(id: string) {
    return this.del(`/menus/admin/${id}`);
  }
}

export const menuService = new MenuService();
