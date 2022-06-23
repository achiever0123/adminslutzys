export interface ISubscription {
  _id: string;
  subscriptionType: string;
  userId: string;
  performerId: string;
  subscriptionId: string;
  transactionId: string;
  paymentGateway: string;
  status: string;
  meta: any;
  startRecurringDate: Date;
  nextRecurringDate: Date;
  createdAt: Date;
  updatedAt: Date;
  expiredAt: Date;
  userInfo: any;
  performerInfo: any;
}

export interface ISubscriptionCreate {
  subscriptionType: string;
  userId: string;
  performerId: string;
  status: string;
  expiredAt: string;
}
