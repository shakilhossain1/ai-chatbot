import axios from 'axios';
import StarRating from './StarRating';
import Skeleton from 'react-loading-skeleton';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '../ui/button';
import { HiSparkles } from 'react-icons/hi2';
import { useState } from 'react';
import ReviewSkeleton from './ReviewSkeleton';

type Props = {
  productId: number;
};

type Review = {
  id: number;
  author: string;
  content: string;
  rating: number;
  created_at: string;
};

type GetReviewResponse = {
  summary: string | null;
  reviews: Review[];
};

type SummarizeResponse = { summary: string };

const ReviewList = ({ productId }: Props) => {
  const {
    mutate: handleSummarize,
    isPending: isSummaryLoading,
    isError: isSummaryError,
    data: summaryData,
  } = useMutation<SummarizeResponse>({
    mutationFn: () => summarizeReviews(),
  });

  const {
    data: reviewData,
    error,
    isLoading,
  } = useQuery<GetReviewResponse>({
    queryKey: ['reviews', productId],
    queryFn: () => fetchReviews(),
  });

  const summarizeReviews = async () => {
    const { data } = await axios.post<SummarizeResponse>(
      `/api/products/${productId}/reviews/summarize`
    );

    return data;
  };

  const fetchReviews = async () => {
    const { data } = await axios.get<GetReviewResponse>(
      `/api/products/${productId}/reviews`
    );
    return data;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-5">
        {[...Array(3)].map((_, i) => (
          <ReviewSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">Could not fetch reviews. Try again!</p>;
  }

  if (!reviewData?.reviews.length) {
    return <p>No reviews yet.</p>;
  }

  const currentSummary = summaryData?.summary || reviewData?.summary;

  return (
    <div>
      <div className="mb-5">
        {currentSummary ? (
          <p className="mb-5 italic text-gray-600">{currentSummary}</p>
        ) : (
          <div>
            <Button
              onClick={() => handleSummarize()}
              className="cursor-pointer"
              disabled={isSummaryLoading}
            >
              <HiSparkles /> Summarize
            </Button>
            {isSummaryLoading && (
              <div className="py-3">
                <ReviewSkeleton />
              </div>
            )}
            {isSummaryError && (
              <p className="text-red-500 mt-2">
                Could not summarize reviews. Try again!
              </p>
            )}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-5">
        {reviewData?.reviews.map((review) => (
          <div key={review.id}>
            <div className="font-semibold">{review.author}</div>
            <div>
              <StarRating value={review.rating} />
            </div>
            <p className="py-2">{review.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
