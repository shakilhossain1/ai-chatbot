import axios from 'axios';
import { useEffect, useState } from 'react';
import StarRating from './StarRating';

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
  const [reviewData, setReviewData] = useState<GetReviewResponse>();

  const fetchReviews = async () => {
    const { data } = await axios.get<GetReviewResponse>(
      `/api/products/${productId}/reviews`
    );
    console.log(data);
    setReviewData(data);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
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
  );
};

export default ReviewList;
