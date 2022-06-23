import { ISearch } from './utils';

export interface IPerformerCategory {
  _id: string;
  name: string;
  slug: string;
}

export interface IPerformerCategoryCreate {
  name: string;
  slug: string;
  ordering: number;
  description: string;
}

export interface IPerformerCategoryUpdate {
  name: string;
  slug: string;
  ordering: number;
  description: string;
}

export interface IPerformerCategorySearch extends ISearch {
  sort: string;
  sortBy: string;
}
