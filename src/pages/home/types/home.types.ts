export type IBookCard = {
  imgurl: string;
  id: number;
  index: number;
  title: string;
  author: string;
  expDate: number;
};

export type IGroupCard = {
  id: string;
  groupName: string;
  hostName?: string;
  memberCount: number;
  imgurl: string;
  description: string;
  isPrivate?: boolean;
};

export interface IHomeData {
  loanData: IBookCard[];
  reservationData: IBookCard[];
  groupData: IGroupCard[];
  isLoadingLoans: boolean;
  isLoadingReservations: boolean;
  isLoadingGroups: boolean;
  error: string | null;
}
