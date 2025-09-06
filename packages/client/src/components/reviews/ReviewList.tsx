import axios from 'axios';
import StarRating from './StarRating';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '../ui/button';
import { HiSparkles } from 'react-icons/hi2';
import ReviewSkeleton from './ReviewSkeleton';
import {
  reviewsApi,
  type GetReviewResponse,
  type SummarizeResponse,
} from './reviewsApi';

type Props = {
  productId: number;
};

const ReviewList = ({ productId }: Props) => {
  const summaryMutation = useMutation<SummarizeResponse>({
    mutationFn: () => reviewsApi.summarizeReviews(productId),
  });

  const reviewsQuery = useQuery<GetReviewResponse>({
    queryKey: ['reviews', productId],
    queryFn: () => reviewsApi.fetchReviews(productId),
  });

  if (reviewsQuery.isLoading) {
    return (
      <div className="flex flex-col gap-5">
        {[...Array(3)].map((_, i) => (
          <ReviewSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (reviewsQuery.isError) {
    return <p className="text-red-500">Could not fetch reviews. Try again!</p>;
  }

  if (!reviewsQuery.data?.reviews.length) {
    return <p>No reviews yet.</p>;
  }

  const currentSummary =
    summaryMutation.data?.summary || reviewsQuery.data?.summary;

  return (
    <div>
      <div className="mb-5">
        {currentSummary ? (
          <p className="mb-5 italic text-gray-600">{currentSummary}</p>
        ) : (
          <div>
            <Button
              onClick={() => summaryMutation.mutate()}
              className="cursor-pointer"
              disabled={summaryMutation.isPending}
            >
              <HiSparkles /> Summarize
            </Button>
            {summaryMutation.isPending && (
              <div className="py-3">
                <ReviewSkeleton />
              </div>
            )}
            {summaryMutation.error && (
              <p className="text-red-500 mt-2">
                Could not summarize reviews. Try again!
              </p>
            )}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-5">
        {reviewsQuery.data?.reviews.map((review) => (
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
