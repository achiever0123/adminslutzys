export interface IProduct {
  _id: string;
  name: string;
  description: string;
  status: string;
  type: string;
  images: any[];
  imageIds: string[];
  categoryIds: string[];
  performerId: string;
  performer: any;
  digitalFileId: string;
  digitalFile: string;
  price: number;
  stock: number;
}
