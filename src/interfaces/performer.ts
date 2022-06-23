export interface IPerformer {
  _id: string;
  firstName: string;
  lastName: string;
  name: string;
  username: string;
  email: string;
  country: string;
  status: string;
  gender: string;
  languages: string[];
  phone: string;
  phoneCode: string;
  city: string;
  state: string;
  address: string;
  zipcode: string;
  avatar: string;
  cover: string;
  idVerification: any;
  documentVerification: any;
  bankingInformation: IBankingSetting;
  monthyPrice: number;
  yearlyPrice: number;
  ccbillSetting: ICCbillSetting;
  commissionSetting: ICommissionSetting;
  verifiedEmail: boolean;
  verifiedAccount: boolean;
  verifiedDocument: boolean;
  dateOfBirth: Date;
}

export interface IBanking {
  firstName: string;
  lastName: string;
  SSN: string;
  bankName: string;
  bankAccount: string;
  bankRouting: string;
  bankSwiftCode: string;
  address: string;
  city: string;
  state: string;
  country: string;
}

export interface CCBillPaymentGateway {
  subscriptionSubAccountNumber: string;
  singlePurchaseSubAccountNumber: string;
  flexformId: string;
  salt: string;
}

export interface ICCbillSetting {
  performerId: string;
  key: string;
  status: string;
  value: CCBillPaymentGateway;
}

export interface ICommissionSetting {
  performerId: string;
  monthlySubscriptionCommission: number;
  yearlySubscriptionCommission: number;
  videoSaleCommission: number;
  productSaleCommission: number;
}

export interface IBankingSetting {
  firstName: string;
  lastName: string;
  SSN: string;
  bankName: string;
  bankAccount: string;
  bankRouting: string;
  bankSwiftCode: string;
  address: string;
  city: string;
  state: string;
  country: string;
  performerId: string;
}

export interface IBody {
  heights: { value: string; text: string }[];
  weights: { value: string; text: string }[];
  genders: { value: string; text: string }[];
  sexualOrientations: { value: string; text: string }[];
  ages: { value: string; text: string }[];
  eyes: { value: string; text: string }[];
  butts: { value: string; text: string }[];
  pubicHairs: { value: string; text: string }[];
  hairs: { value: string; text: string }[];
  ethnicities: { value: string; text: string }[];
  bodyTypes: { value: string; text: string }[];
}
