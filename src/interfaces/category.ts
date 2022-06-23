export interface ICategory {
  _id: string;
  group: string;
  name: string;
  slug: string;
  ordering: number;
  description: String;
  status: string;
  createdBy: string;
  updatedBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}
