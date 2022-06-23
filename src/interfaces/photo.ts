export interface IPhoto {
  _id: string;
  title: string;
  performerId: string;
  token: number;
  status: string;
  description: string;
  galleryId: string;
}

export interface IPhotoCreate {
  title: string;
  performerId: string;
  token: number;
  status: string;
  description: string;
  galleryId: string;
}

export interface IPhotoUpdate {
  _id: string;
  performerId?: string;
  title?: string;
  token?: number;
  status?: string;
  description?: string;
  thumbnail?: string;
  photo?: { url: string; thumbnails: string[] };
  performer?: { username: string };
  galleryId?: string;
}
