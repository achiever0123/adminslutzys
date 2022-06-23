import { APIRequest } from './api-request';

export class VideoService extends APIRequest {
  search(query?: { [key: string]: any }) {
    return this.get(
      this.buildUrl('/admin/performer-assets/videos/search', query)
    );
  }

  findById(id: string) {
    return this.get(`/admin/performer-assets/videos/${id}/view`);
  }

  update(
    id: string,
    files: [{ fieldname: string; file: File }],
    payload: any,
    onProgress?: Function
  ) {
    return this.upload(`/admin/performer-assets/videos/edit/${id}`, files, {
      onProgress,
      customData: payload
    });
  }

  uploadVideo(
    files: [{ fieldname: string; file: File }],
    payload: any,
    onProgress?: Function
  ) {
    return this.upload('/admin/performer-assets/videos/upload', files, {
      onProgress,
      customData: payload
    });
  }

  delete(id: string) {
    return this.del(`/admin/performer-assets/videos/${id}`);
  }
}

export const videoService = new VideoService();
