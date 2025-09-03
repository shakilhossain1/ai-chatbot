import { PrismaClient, type Review } from '../generated/prisma';

export const reviewRepository = {
  async getReviews(productId: number): Promise<Review[]> {
    const prisma = new PrismaClient();

    return prisma.review.findMany({
      where: { productId },
      orderBy: { created_at: 'desc' },
    });
  },
};
