import axios from 'axios';
import StarRating from './StarRating';
import Skeleton from 'react-loading-skeleton';
import { useQuery } from '@tanstack/react-query';
import { Button } from '../ui/button';
import { HiSparkles } from 'react-icons/hi2';

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

const ReviewList = ({ productId }: Props) => {
  const {
    data: reviewData,
    error,
    isLoading,
  } = useQuery<GetReviewResponse>({
    queryKey: ['reviews', productId],
    queryFn: () => fetchReviews(),
  });

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
          <div key={i} className="space-y-2">
            <Skeleton width={150} />
            <Skeleton width={100} />
            <Skeleton count={2} />
          </div>
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

  return (
    <div>
      <div className="mb-5">
        {reviewData?.summary ? (
          <p className="mb-5 italic text-gray-600">{reviewData.summary}</p>
        ) : (
          <Button>
            <HiSparkles /> Summarize
          </Button>
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
