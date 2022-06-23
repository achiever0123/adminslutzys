import { APIRequest } from './api-request';

export class ProductService extends APIRequest {
  createProduct(
    files: [{ fieldname: string; file: File }],
    payload: any,
    onProgress?: Function
  ) {
    return this.upload('/admin/performer-assets/products', files, {
      onProgress,
      customData: payload
    });
  }

  uploadImage(
    file: File,
    payload: any,
    onProgress?: Function
  ) {
    return this.upload('/admin/performer-assets/products/image', [{
      fieldname: 'image',
      file
    }], {
      onProgress,
      customData: payload
    });
  }

  update(
    id: string,
    files: [{ fieldname: string; file: File }],
    payload: any,
    onProgress?: Function
  ) {
    return this.upload(`/admin/performer-assets/products/${id}`, files, {
      onProgress,
      customData: payload,
      method: 'PUT'
    });
  }

  search(query?: { [key: string]: any }) {
    return this.get(
      this.buildUrl('/admin/performer-assets/products/search', query)
    );
  }

  findById(id: string) {
    return this.get(`/admin/performer-assets/products/${id}/view`);
  }

  delete(id: string) {
    return this.del(`/admin/performer-assets/products/${id}`);
  }
}

export const productService = new ProductService();
