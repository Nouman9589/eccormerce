import React, { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, Calendar, CheckCircle, Edit3, Trash2 } from 'lucide-react';
import { useReviewsContext, Review } from '../Context/ReviewsContext';
import { useAuth } from '../Context/AuthContext';

interface ReviewSectionProps {
  productId: string;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ productId }) => {
  const { getProductReviews, getProductRating, addReview, markHelpful, deleteReview } = useReviewsContext();
  const { user, isAuthenticated } = useAuth();
  const [showAddReview, setShowAddReview] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful'>('newest');

  const productReviews = getProductReviews(productId);
  const { averageRating, totalReviews } = getProductRating(productId);

  // Sort reviews based on selected option
  const sortedReviews = [...productReviews].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      case 'helpful':
        return b.helpful - a.helpful;
      default:
        return 0;
    }
  });

  const AddReviewForm: React.FC = () => {
    const [formData, setFormData] = useState({
      rating: 5,
      title: '',
      comment: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!user) return;

      addReview({
        productId,
        userId: user.id,
        userName: user.name || 'Anonymous',
        userAvatar: user.avatar || undefined,
        rating: formData.rating,
        title: formData.title,
        comment: formData.comment,
        verified: true
      });

      setFormData({ rating: 5, title: '', comment: '' });
      setShowAddReview(false);
    };

    return (
      <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Edit3 className="w-5 h-5" />
          Write a Review
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star 
                    className={`w-6 h-6 ${
                      star <= formData.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Review Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Summarize your experience..."
            />
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
            <textarea
              required
              rows={4}
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Tell others about your experience with this product..."
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Submit Review
            </button>
            <button
              type="button"
              onClick={() => setShowAddReview(false)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  };

  const ReviewCard: React.FC<{ review: Review }> = ({ review }) => {
    const reviewDate = new Date(review.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const canDelete = user && (user.id === review.userId || user.role === 'admin');

    return (
      <div className="border border-gray-200 rounded-lg p-6 bg-white">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
              {review.userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">{review.userName}</span>
                {review.verified && (
                  <span title="Verified Purchase">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-3 h-3" />
                {reviewDate}
              </div>
            </div>
          </div>
          
          {canDelete && (
            <button
              onClick={() => deleteReview(review.id)}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              title="Delete review"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star}
                className={`w-4 h-4 ${
                  star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">({review.rating}/5)</span>
        </div>

        {/* Review Content */}
        <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
        <p className="text-gray-700 mb-4 leading-relaxed">{review.comment}</p>

        {/* Helpful Buttons */}
        <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
          <span className="text-sm text-gray-600">Was this helpful?</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => markHelpful(review.id, true)}
              className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            >
              <ThumbsUp className="w-4 h-4" />
              Yes ({review.helpful})
            </button>
            <button
              onClick={() => markHelpful(review.id, false)}
              className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <ThumbsDown className="w-4 h-4" />
              No ({review.notHelpful})
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Rating Overview */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Customer Reviews</h2>
        
        <div className="flex items-center gap-6 mb-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-1">
              {averageRating > 0 ? averageRating : 'No'}
            </div>
            <div className="flex justify-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <div className="text-sm text-gray-600">
              {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
            </div>
          </div>

          <div className="flex-1">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = productReviews.filter(r => r.rating === rating).length;
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              
              return (
                <div key={rating} className="flex items-center gap-3 mb-1">
                  <span className="text-sm text-gray-600 w-8">{rating}★</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-400 transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-8">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Write Review Button */}
        {isAuthenticated && !showAddReview && (
          <button
            onClick={() => setShowAddReview(true)}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center gap-2"
          >
            <Edit3 className="w-4 h-4" />
            Write a Review
          </button>
        )}
      </div>

      {/* Add Review Form */}
      {showAddReview && <AddReviewForm />}

      {/* Reviews List */}
      {totalReviews > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Reviews ({totalReviews})
            </h3>
            
            {/* Sort Options */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>

          <div className="space-y-4">
            {sortedReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      )}

      {/* No Reviews State */}
      {totalReviews === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
          <p className="text-gray-600 mb-4">Be the first to share your experience with this product.</p>
          {isAuthenticated && (
            <button
              onClick={() => setShowAddReview(true)}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Write the First Review
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewSection; 