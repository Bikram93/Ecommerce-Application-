import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useApp } from '../context/AppContext';
import { Star, ShoppingBag, Heart, ArrowLeft, ShieldCheck, Truck, RefreshCw, Send, CheckCircle2 } from 'lucide-react';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist, user, showToast } = useApp();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Review submission state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/products/${slug}/`);
        setProduct(res.data);
        setSelectedImage(res.data.thumbnail_url);
      } catch (err) {
        console.error('Error loading product details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [slug]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast('Please login to leave a review.', 'error');
      return;
    }
    if (!reviewComment.trim()) {
      showToast('Please provide a comment.', 'error');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await axios.post(`/api/products/${product.id}/reviews/`, {
        rating: reviewRating,
        comment: reviewComment.trim(),
      });
      setProduct((prev) => ({
        ...prev,
        reviews: [res.data, ...(prev.reviews || [])],
        reviews_count: (prev.reviews_count || 0) + 1,
      }));
      setReviewComment('');
      showToast('Review submitted successfully!', 'success');
    } catch (err) {
      showToast('Could not submit review.', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-slate-200 aspect-square rounded-3xl"></div>
          <div className="space-y-4">
            <div className="h-8 bg-slate-200 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/4"></div>
            <div className="h-6 bg-slate-200 rounded w-1/3"></div>
            <div className="h-24 bg-slate-200 rounded w-full"></div>
            <div className="h-12 bg-slate-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Product not found</h2>
        <Link to="/" className="mt-4 inline-flex items-center gap-2 text-indigo-600 font-semibold">
          <ArrowLeft className="w-4 h-4" /> Back to Catalog
        </Link>
      </div>
    );
  }

  const favorite = isInWishlist(product.id);
  const activePrice = product.discount_price ? Number(product.discount_price) : Number(product.price);

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Navigation */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Product Primary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm">
        {/* Left: Image Gallery */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
            <img
              src={selectedImage || product.thumbnail_url}
              alt={product.title}
              className="w-full h-full object-cover object-center"
            />
            {product.discount_price && (
              <span className="absolute top-4 left-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                SALE
              </span>
            )}
          </div>

          {/* Thumbnails list */}
          {product.images && product.images.length > 0 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedImage(product.thumbnail_url)}
                className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition ${
                  selectedImage === product.thumbnail_url ? 'border-indigo-600' : 'border-slate-200 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={product.thumbnail_url} alt="Main" className="w-full h-full object-cover" />
              </button>
              {product.images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img.image_url)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition ${
                    selectedImage === img.image_url ? 'border-indigo-600' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.image_url} alt="Gallery" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Specifications & CTA */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider">
                {product.category?.name}
              </span>
              <span className="text-xs font-mono text-slate-400">SKU: {product.sku}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {product.title}
            </h1>

            {/* Ratings & Stock info */}
            <div className="flex items-center gap-4 mt-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-1.5 text-amber-500 font-bold text-sm">
                <Star className="w-4 h-4 fill-current" />
                <span>{Number(product.rating).toFixed(1)}</span>
                <span className="text-slate-400 font-normal">({product.reviews_count} reviews)</span>
              </div>
              <span className="text-slate-300">|</span>
              <span className={`text-xs font-semibold ${product.stock > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Out of Stock'}
              </span>
            </div>

            {/* Price Box */}
            <div className="mt-5 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-slate-900">
                ${activePrice.toFixed(2)}
              </span>
              {product.discount_price && (
                <span className="text-lg text-slate-400 line-through">
                  ${Number(product.price).toFixed(2)}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="mt-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Overview</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Value Props */}
            <div className="grid grid-cols-3 gap-3 mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <div className="flex flex-col items-center gap-1 text-[11px] text-slate-600 font-medium">
                <Truck className="w-4 h-4 text-indigo-600" />
                <span>Free Ship &gt; $100</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-[11px] text-slate-600 font-medium">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>Official Warranty</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-[11px] text-slate-600 font-medium">
                <RefreshCw className="w-4 h-4 text-indigo-600" />
                <span>30-Day Returns</span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-4">
            {/* Quantity Selector */}
            <div className="flex items-center border border-slate-200 rounded-xl p-1 bg-slate-50 w-full sm:w-auto">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                className="w-10 h-10 flex items-center justify-center font-bold text-slate-600 hover:bg-white rounded-lg transition disabled:opacity-30"
              >
                -
              </button>
              <span className="w-12 text-center text-sm font-bold text-slate-800">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                disabled={quantity >= product.stock}
                className="w-10 h-10 flex items-center justify-center font-bold text-slate-600 hover:bg-white rounded-lg transition disabled:opacity-30"
              >
                +
              </button>
            </div>

            {/* Add to Cart */}
            <button
              onClick={() => addToCart(product.id, quantity)}
              disabled={product.stock <= 0}
              className="flex-1 w-full py-3.5 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg hover:shadow-indigo-500/30 transition flex items-center justify-center gap-2 text-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              Add {quantity} to Cart (${(activePrice * quantity).toFixed(2)})
            </button>

            {/* Wishlist Heart */}
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`p-3.5 rounded-xl border transition ${
                favorite
                  ? 'border-rose-200 bg-rose-50 text-rose-500'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
              title={favorite ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart className={`w-5 h-5 ${favorite ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="mt-12 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          Customer Reviews ({product.reviews?.length || 0})
        </h2>

        {/* Add Review Form */}
        <form onSubmit={handleReviewSubmit} className="mb-10 p-5 rounded-2xl bg-slate-50 border border-slate-200/60">
          <h3 className="text-sm font-bold text-slate-800 mb-3">Leave a Review</h3>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-medium text-slate-500">Rating:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setReviewRating(star)}
                className={`transition ${star <= reviewRating ? 'text-amber-500' : 'text-slate-300'}`}
              >
                <Star className="w-5 h-5 fill-current" />
              </button>
            ))}
          </div>

          <textarea
            rows="3"
            placeholder={user ? "Write your experience with this product..." : "Please log in to leave a review."}
            disabled={!user || submittingReview}
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          ></textarea>

          <div className="mt-3 flex justify-end">
            <button
              type="submit"
              disabled={!user || submittingReview}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow transition flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              {submittingReview ? 'Submitting...' : 'Post Review'}
            </button>
          </div>
        </form>

        {/* Reviews List */}
        <div className="space-y-4">
          {!product.reviews || product.reviews.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-6">No customer reviews yet. Be the first to review!</p>
          ) : (
            product.reviews.map((rev, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800">{rev.user_name || rev.user_email}</span>
                  <div className="flex items-center text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-slate-600">{rev.comment}</p>
                <span className="text-[10px] text-slate-400 mt-2 block">
                  {new Date(rev.created_at).toLocaleDateString()}
                </span>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
