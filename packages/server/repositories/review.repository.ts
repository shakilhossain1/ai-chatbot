import dayjs from 'dayjs';
import { PrismaClient, type Review } from '../generated/prisma';

const prisma = new PrismaClient();

export const reviewRepository = {
  async getReviews(productId: number, limit?: number): Promise<Review[]> {
    return prisma.review.findMany({
      where: { productId },
      orderBy: { created_at: 'desc' },
      take: limit,
    });
  },

  storeReviewSummary(productId: number, summary: string) {
    const expires_at = dayjs().add(7, 'days').toDate();

    const data = {
      content: summary,
      expires_at,
      productId,
    };

    return prisma.summary.upsert({
      where: { productId },
      create: data,
      update: data,
    });
  },
  getReviewSummary(productId: number) {
    return prisma.summary.findUnique({
      where: { productId },
    });
  },
};
