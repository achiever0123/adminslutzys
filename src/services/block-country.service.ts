import { APIRequest } from './api-request';

export class BlockCountryService extends APIRequest {
  search(query?: { [key: string]: any }) {
    return this.get(this.buildUrl('/admin/block/countries/search', query));
  }

  create(code: string) {
    return this.post('/admin/block/countries', { countryCode: code });
  }

  delete(code: string) {
    return this.del(`/admin/block/countries/${code}`);
  }
}

export const blockCountryService = new BlockCountryService();
