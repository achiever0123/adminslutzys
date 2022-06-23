import { IPostCreate, IPostSearch, IPostUpdate } from 'src/interfaces';
import { APIRequest } from './api-request';

export class PostService extends APIRequest {
  create(payload: IPostCreate) {
    return this.post('/admin/posts', payload);
  }

  search(query: IPostSearch) {
    return this.get(this.buildUrl('/admin/posts/search', query as any));
  }

  findById(id: string) {
    return this.get(`/admin/posts/${id}/view`);
  }

  update(id: string, payload: IPostUpdate) {
    return this.put(`/admin/posts/${id}`, payload);
  }

  delete(id: string) {
    return this.del(`/admin/posts/${id}`);
  }
}

export const postService = new PostService();
