export interface IReview {
  id: number;
  nickname: string;
  rating: number;
  date: string;
  content: string;
  profileImgUrl?: string;
}

export interface IReviewData {
  reviews: IReview[];
  isLoading: boolean;
  error: string | null;
}
