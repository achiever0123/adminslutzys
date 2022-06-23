export interface IVideo {
  _id: string;

  performerId: string;

  categoryIds: string[];

  fileId: string;

  title: string;

  description: string;

  status: string;

  tags: string[];

  teaserId: string;

  teaser: any;

  teaserProcessing: boolean;

  processing: boolean;

  thumbnailId: string;

  isSaleVideo: boolean;

  price: number;

  thumbnail: any;

  video: any;

  participantIds: string[];

  stats: {
    views: number;
    likes: number;
    comments: number;
  };

  isSchedule: boolean;

  scheduledAt: any;

  createdBy: string;

  updatedBy: string;

  createdAt: Date;

  updatedAt: Date;
}
