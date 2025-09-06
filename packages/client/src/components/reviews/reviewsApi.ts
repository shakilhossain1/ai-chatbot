import axios from 'axios';

export type Review = {
  id: number;
  author: string;
  content: string;
  rating: number;
  created_at: string;
};

export type GetReviewResponse = {
  summary: string | null;
  reviews: Review[];
};

export type SummarizeResponse = { summary: string };

export const reviewsApi = {
  fetchReviews(productId: number) {
    return axios
      .get<GetReviewResponse>(`/api/products/${productId}/reviews`)
      .then((res) => res.data);
  },

  summarizeReviews(productId: number) {
    return axios
      .post<SummarizeResponse>(`/api/products/${productId}/reviews/summarize`)
      .then((res) => res.data);
  },
};
