export interface IBanner {
  _id: string;
  title: string;
  status: string;
  description: string;
  position: string;
}

export interface IBannerCreate {
  title: string;
  status: string;
  description: string;
  position: string;
}

export interface IBannerUpdate {
  _id: string;
  title?: string;
  status?: string;
  description?: string;
  thumbnail?: string;
  photo?: { url: string; thumbnails: string[] };
  position: string;
}
