import React, { useState } from 'react';
import { Star, Plus, Sparkles, Filter, X, ShieldCheck } from 'lucide-react';
import { REVIEWS_DATA } from '../data/reviews';
import { CustomerReview, ActivePage } from '../types';
import { PRODUCTS } from '../data/products';
import { BRAND_CONFIG } from '../config/config';

interface ReviewsPageProps {
  setActivePage: (page: ActivePage) => void;
}

export const ReviewsPage: React.FC<ReviewsPageProps> = ({ setActivePage }) => {
  const [reviewsList, setReviewsList] = useState<CustomerReview[]>(REVIEWS_DATA);
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newName, setNewName] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newProduct, setNewProduct] = useState(PRODUCTS[0].name);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState(false);

  const filteredReviews = reviewsList.filter((r) => {
    if (ratingFilter !== 'all' && r.rating !== ratingFilter) return false;
    return true;
  });

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newComment.trim()) return;

    const newReview: CustomerReview = {
      id: `rev-${Date.now()}`,
      name: newName.trim(),
      city: newCity.trim() || 'Verified Patron',
      productName: newProduct,
      rating: newRating,
      date: 'Just now',
      comment: newComment.trim(),
      verifiedBuyer: true,
    };

    setReviewsList([newReview, ...reviewsList]);
    setSubmittedMessage(true);

    setTimeout(() => {
      setSubmittedMessage(false);
      setIsModalOpen(false);
      setNewName('');
      setNewCity('');
      setNewComment('');
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 bg-transparent text-[#30272A]">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-[0.25em] text-[#765C46] font-semibold flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#D6B887]" />
          Authentic Patron Experiences
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#591D2B] font-normal">
          Customer Reviews
        </h1>
        <p className="text-sm text-[#30272A]/75 leading-relaxed">
          Read genuine impressions from fragrance enthusiasts who have experienced the longevity and craftsmanship of {BRAND_CONFIG.brandName}.
        </p>

        <div className="pt-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2.5 rounded-lg text-xs font-semibold tracking-wider bg-[#591D2B] hover:bg-[#713142] text-white inline-flex items-center gap-2 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>WRITE A REVIEW</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between border-b border-[#DED1BE] pb-4 text-xs">
        <div className="flex items-center gap-2 text-[#765C46]">
          <Filter className="w-3.5 h-3.5 text-[#591D2B]" />
          <span>Filter by rating:</span>
          {[
            { id: 'all', label: 'All Reviews' },
            { id: 5, label: '5 Stars' },
            { id: 4, label: '4 Stars' },
          ].map((item) => (
            <button
              key={String(item.id)}
              onClick={() => setRatingFilter(item.id as number | 'all')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                ratingFilter === item.id
                  ? 'bg-[#591D2B] text-white font-semibold'
                  : 'bg-white border border-[#DED1BE] text-[#30272A] hover:bg-[#EDE1D0]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <span className="text-[#765C46]">{filteredReviews.length} Verified Reviews</span>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-white border border-[#DED1BE] rounded-2xl p-6 flex flex-col justify-between shadow-xs space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-[#D6B887]">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#D6B887]" />
                  ))}
                </div>
                <span className="text-xs text-[#6B6258]">{rev.date}</span>
              </div>

              <p className="text-sm text-[#30272A]/85 leading-relaxed italic">
                "{rev.comment}"
              </p>
            </div>

            <div className="pt-4 border-t border-[#DED1BE]/60 flex items-center justify-between">
              <div>
                <span className="font-serif text-sm font-bold text-[#591D2B] block">
                  {rev.name}
                </span>
                <span className="text-xs text-[#765C46]">
                  {rev.city ? `${rev.city} · ` : ''}
                  <span className="text-[#591D2B] font-medium">{rev.productName}</span>
                </span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-[#765C46] font-medium bg-[#EDE1D0] px-2 py-0.5 rounded">
                <ShieldCheck className="w-3 h-3 text-[#591D2B]" />
                <span>Verified</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Write a Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#30272A]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-[#DED1BE] p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 text-[#30272A]">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-[#6B6258] hover:text-[#591D2B] hover:bg-[#F7F0E5]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-xl font-normal text-[#591D2B] mb-1">Share Your Scent Experience</h3>
            <p className="text-xs text-[#765C46] mb-4">
              Help other connoisseurs discover the right attar.
            </p>

            {submittedMessage ? (
              <div className="py-8 text-center text-[#591D2B] font-semibold text-sm">
                Thank you! Your verified review has been published.
              </div>
            ) : (
              <form onSubmit={handleAddReview} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#591D2B] font-semibold mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Farhan Ali"
                    className="w-full bg-[#F7F0E5] border border-[#DED1BE] rounded-lg px-3 py-2 text-sm text-[#30272A] focus:outline-none focus:border-[#591D2B]"
                  />
                </div>

                <div>
                  <label className="block text-[#591D2B] font-semibold mb-1">City / Region (Optional)</label>
                  <input
                    type="text"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    placeholder="e.g. Kolkata, West Bengal"
                    className="w-full bg-[#F7F0E5] border border-[#DED1BE] rounded-lg px-3 py-2 text-sm text-[#30272A] focus:outline-none focus:border-[#591D2B]"
                  />
                </div>

                <div>
                  <label className="block text-[#591D2B] font-semibold mb-1">Attar Purchased</label>
                  <select
                    value={newProduct}
                    onChange={(e) => setNewProduct(e.target.value)}
                    className="w-full bg-[#F7F0E5] border border-[#DED1BE] rounded-lg px-3 py-2 text-sm text-[#30272A] focus:outline-none focus:border-[#591D2B]"
                  >
                    {PRODUCTS.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#591D2B] font-semibold mb-1">Rating</label>
                  <div className="flex gap-2">
                    {[5, 4, 3].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className={`px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-1 ${
                          newRating === star
                            ? 'bg-[#591D2B] text-white border-[#591D2B]'
                            : 'bg-[#F7F0E5] border-[#DED1BE] text-[#30272A]'
                        }`}
                      >
                        <Star className="w-3.5 h-3.5 fill-[#D6B887]" />
                        <span>{star} Stars</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[#591D2B] font-semibold mb-1">Your Honest Review</label>
                  <textarea
                    required
                    rows={3}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Describe how the fragrance smelled, how long it stayed on your skin, and the compliments you received..."
                    className="w-full bg-[#F7F0E5] border border-[#DED1BE] rounded-lg p-3 text-sm text-[#30272A] focus:outline-none focus:border-[#591D2B]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-[#591D2B] hover:bg-[#713142] text-white font-semibold tracking-wider text-xs transition-colors"
                >
                  SUBMIT REVIEW
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
