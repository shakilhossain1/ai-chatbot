import axios from 'axios';
import StarRating from './StarRating';
import Skeleton from 'react-loading-skeleton';
import { useQuery } from '@tanstack/react-query';
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
  const [summary, setSummary] = useState('');
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState('');

  const {
    data: reviewData,
    error,
    isLoading,
  } = useQuery<GetReviewResponse>({
    queryKey: ['reviews', productId],
    queryFn: () => fetchReviews(),
  });

  const handleSummarize = async () => {
    try {
      setSummaryError('');
      setIsSummaryLoading(true);
      const { data } = await axios.post<SummarizeResponse>(
        `/api/products/${productId}/reviews/summarize`
      );

      setSummary(data.summary);
    } catch (error) {
      console.error(error);
      setSummaryError('could not summarize the reviews. Try again!');
    } finally {
      setIsSummaryLoading(false);
    }
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

  const currentSummary = summary || reviewData?.summary;

  return (
    <div>
      <div className="mb-5">
        {currentSummary ? (
          <p className="mb-5 italic text-gray-600">{currentSummary}</p>
        ) : (
          <div>
            <Button
              onClick={handleSummarize}
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
            {summaryError && (
              <p className="text-red-500 mt-2">{summaryError}</p>
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
