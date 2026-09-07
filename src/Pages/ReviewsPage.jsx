import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ReviewsPage() {
  const navigate = useNavigate();

  // ==========================================
  // STATE
  // ==========================================

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedReview, setSelectedReview] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [ratingFilter, setRatingFilter] = useState('ALL');

  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // ==========================================
  // API URL
  // ==========================================

  const API_URL = 'http://localhost:8082/api/reviews';

  // ==========================================
  // JWT HEADERS
  // ==========================================

  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');

    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  // ==========================================
  // FETCH REVIEWS
  // ==========================================

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(API_URL, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to load reviews. Status: ${response.status}`
        );
      }

      const data = await response.json();

      setReviews(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading reviews:', error);

      setError(
        'Unable to load reviews. Please make sure the backend is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD REVIEWS
  // ==========================================

  useEffect(() => {
    fetchReviews();
  }, []);

  // ==========================================
  // VIEW REVIEW
  // ==========================================

  const handleViewReview = (review) => {
    setSelectedReview(review);
    setShowModal(true);
  };

  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const closeModal = () => {
    setSelectedReview(null);
    setShowModal(false);
  };

  // ==========================================
  // DELETE REVIEW
  // ==========================================

  const handleDeleteReview = async (review) => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete the review from "${review.customerName}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(review.id);

      const response = await fetch(
        `${API_URL}/${review.id}`,
        {
          method: 'DELETE',
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to delete review. Status: ${response.status}`
        );
      }

      setReviews((previousReviews) =>
        previousReviews.filter(
          (item) => item.id !== review.id
        )
      );

      closeModal();

      alert('Review deleted successfully.');
    } catch (error) {
      console.error('Error deleting review:', error);

      alert(
        'Unable to delete review. Please try again.'
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================
  // UPDATE REVIEW STATUS
  // ==========================================

  const handleStatusChange = async (
    review,
    newStatus
  ) => {
    try {
      setUpdatingId(review.id);

      const response = await fetch(
        `${API_URL}/${review.id}/status?status=${encodeURIComponent(
          newStatus
        )}`,
        {
          method: 'PUT',
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to update review status. Status: ${response.status}`
        );
      }

      const updatedReview = await response.json();

      setReviews((previousReviews) =>
        previousReviews.map((item) =>
          item.id === review.id
            ? updatedReview
            : item
        )
      );

      setSelectedReview(updatedReview);

      if (newStatus === 'PUBLISHED') {
        alert('Review published successfully.');
      } else {
        alert('Review moved to pending.');
      }
    } catch (error) {
      console.error(
        'Error updating review status:',
        error
      );

      alert(
        'Unable to update review status. Please try again.'
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // ==========================================
  // STATISTICS
  // ==========================================

  const totalReviews = reviews.length;

  const publishedReviews = reviews.filter(
    (review) =>
      review.status?.toUpperCase() === 'PUBLISHED'
  ).length;

  const pendingReviews = reviews.filter(
    (review) =>
      review.status?.toUpperCase() === 'PENDING'
  ).length;

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce(
            (total, review) =>
              total + Number(review.rating || 0),
            0
          ) / reviews.length
        ).toFixed(1)
      : '0.0';

  // ==========================================
  // FILTER REVIEWS
  // ==========================================

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      const customerName =
        review.customerName?.toLowerCase() || '';

      const comment =
        review.comment?.toLowerCase() || '';

      const search =
        searchTerm.toLowerCase().trim();

      const matchesSearch =
        !search ||
        customerName.includes(search) ||
        comment.includes(search);

      const reviewStatus =
        review.status?.toUpperCase() || 'PENDING';

      const matchesStatus =
        statusFilter === 'ALL' ||
        reviewStatus === statusFilter;

      const matchesRating =
        ratingFilter === 'ALL' ||
        Number(review.rating) === Number(ratingFilter);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesRating
      );
    });
  }, [
    reviews,
    searchTerm,
    statusFilter,
    ratingFilter,
  ]);

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return '-';
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // ==========================================
  // STATUS STYLE
  // ==========================================

  const getStatusClasses = (status) => {
    if (
      status?.toUpperCase() === 'PUBLISHED'
    ) {
      return 'bg-green-100 text-green-700';
    }

    return 'bg-yellow-100 text-yellow-700';
  };

  // ==========================================
  // RATING STARS
  // ==========================================

  const renderStars = (rating) => {
    const numericRating = Number(rating) || 0;

    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={
              star <= numericRating
                ? 'text-yellow-500'
                : 'text-slate-300'
            }
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  // ==========================================
  // CLEAR FILTERS
  // ==========================================

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('ALL');
    setRatingFilter('ALL');
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-100 flex">

      {/* ==========================================
          SIDEBAR
      ========================================== */}

      <aside className="hidden md:flex w-64 bg-slate-950 text-white flex-col">

        <div className="px-6 py-6 border-b border-slate-800">
          <h1 className="text-xl font-bold">
            Family Tours
          </h1>

          <p className="text-sm text-slate-400 mt-1">
            Admin Panel
          </p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">

          <button
            onClick={() => navigate('/admin')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition text-left"
          >
            <span>📊</span>
            <span>Dashboard</span>
          </button>

          <button
            onClick={() =>
              navigate('/admin/bookings')
            }
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition text-left"
          >
            <span>📅</span>
            <span>Bookings</span>
          </button>

          <button
            onClick={() =>
              navigate('/admin/tour-packages')
            }
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition text-left"
          >
            <span>🧳</span>
            <span>Tour Packages</span>
          </button>

          <button
            onClick={() =>
              navigate('/admin/vehicles')
            }
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition text-left"
          >
            <span>🚗</span>
            <span>Vehicles</span>
          </button>

          <button
            onClick={() =>
              navigate('/admin/customers')
            }
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition text-left"
          >
            <span>👥</span>
            <span>Customers</span>
          </button>

          <button
            onClick={() =>
              navigate('/admin/reviews')
            }
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-white/10 text-white text-left"
          >
            <span>⭐</span>
            <span>Reviews</span>
          </button>

        </nav>

        <div className="px-4 py-5 border-t border-slate-800">

          <button
            onClick={() =>
              navigate('/admin/settings')
            }
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition text-left"
          >
            <span>⚙️</span>
            <span>Settings</span>
          </button>

          <button
            onClick={() =>
              navigate('/admin/logout')
            }
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition text-left mt-2"
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>

        </div>

      </aside>

      {/* ==========================================
          MAIN CONTENT
      ========================================== */}

      <main className="flex-1 min-w-0">

        {/* TOP BAR */}

        <header className="bg-white border-b border-slate-200 px-6 md:px-8 py-5">

          <h2 className="text-2xl font-bold text-slate-900">
            Reviews
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            View and manage customer reviews
          </p>

        </header>

        {/* CONTENT */}

        <div className="p-6 md:p-8">

          {/* BACK */}

          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 mb-6 transition"
          >
            ← Back to Dashboard
          </button>

          {/* ERROR */}

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-5">

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                <div>
                  <p className="font-semibold text-red-700">
                    Unable to load reviews
                  </p>

                  <p className="text-sm text-red-600 mt-1">
                    {error}
                  </p>
                </div>

                <button
                  onClick={fetchReviews}
                  className="px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition"
                >
                  Retry
                </button>

              </div>

            </div>
          )}

          {/* ==========================================
              STATISTICS
          ========================================== */}

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-start justify-between">

                <div>
                  <p className="text-sm text-slate-500">
                    Total Reviews
                  </p>

                  <h3 className="text-3xl font-bold text-slate-900 mt-2">
                    {loading ? '...' : totalReviews}
                  </h3>
                </div>

                <div className="w-11 h-11 rounded-lg bg-slate-100 flex items-center justify-center text-xl">
                  ⭐
                </div>

              </div>

              <p className="text-xs text-slate-500 mt-4">
                All customer reviews
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-start justify-between">

                <div>
                  <p className="text-sm text-slate-500">
                    Average Rating
                  </p>

                  <h3 className="text-3xl font-bold text-slate-900 mt-2">
                    {loading ? '...' : averageRating}
                  </h3>
                </div>

                <div className="w-11 h-11 rounded-lg bg-yellow-100 flex items-center justify-center text-xl">
                  ⭐
                </div>

              </div>

              <p className="text-xs text-slate-500 mt-4">
                Customer satisfaction
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-start justify-between">

                <div>
                  <p className="text-sm text-slate-500">
                    Published
                  </p>

                  <h3 className="text-3xl font-bold text-slate-900 mt-2">
                    {loading ? '...' : publishedReviews}
                  </h3>
                </div>

                <div className="w-11 h-11 rounded-lg bg-green-100 flex items-center justify-center text-xl">
                  ✅
                </div>

              </div>

              <p className="text-xs text-slate-500 mt-4">
                Visible to customers
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-start justify-between">

                <div>
                  <p className="text-sm text-slate-500">
                    Pending
                  </p>

                  <h3 className="text-3xl font-bold text-slate-900 mt-2">
                    {loading ? '...' : pendingReviews}
                  </h3>
                </div>

                <div className="w-11 h-11 rounded-lg bg-yellow-100 flex items-center justify-center text-xl">
                  ⏳
                </div>

              </div>

              <p className="text-xs text-slate-500 mt-4">
                Waiting for review
              </p>
            </div>

          </div>

          {/* ==========================================
              REVIEWS TABLE
          ========================================== */}

          <div className="mt-8 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

            {/* HEADER */}

            <div className="px-6 py-5 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Customer Reviews
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  View and manage reviews submitted by customers
                </p>
              </div>

              <button
                onClick={fetchReviews}
                disabled={loading}
                className="px-4 py-2.5 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 transition disabled:opacity-50"
              >
                🔄 Refresh
              </button>

            </div>

            {/* ==========================================
                FILTERS
            ========================================== */}

            <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* SEARCH */}

                <div className="md:col-span-1">

                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">
                    Search
                  </label>

                  <div className="relative">

                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      🔍
                    </span>

                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) =>
                        setSearchTerm(e.target.value)
                      }
                      placeholder="Search customer or review..."
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-slate-400"
                    />

                  </div>

                </div>

                {/* STATUS */}

                <div>

                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">
                    Status
                  </label>

                  <select
                    value={statusFilter}
                    onChange={(e) =>
                      setStatusFilter(e.target.value)
                    }
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-slate-400"
                  >
                    <option value="ALL">
                      All Statuses
                    </option>

                    <option value="PUBLISHED">
                      Published
                    </option>

                    <option value="PENDING">
                      Pending
                    </option>
                  </select>

                </div>

                {/* RATING */}

                <div>

                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">
                    Rating
                  </label>

                  <select
                    value={ratingFilter}
                    onChange={(e) =>
                      setRatingFilter(e.target.value)
                    }
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-slate-400"
                  >
                    <option value="ALL">
                      All Ratings
                    </option>

                    <option value="5">
                      ⭐ 5 Stars
                    </option>

                    <option value="4">
                      ⭐ 4 Stars
                    </option>

                    <option value="3">
                      ⭐ 3 Stars
                    </option>

                    <option value="2">
                      ⭐ 2 Stars
                    </option>

                    <option value="1">
                      ⭐ 1 Star
                    </option>
                  </select>

                </div>

              </div>

              {/* FILTER FOOTER */}

              <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                <p className="text-sm text-slate-500">
                  Showing{' '}
                  <span className="font-semibold text-slate-800">
                    {filteredReviews.length}
                  </span>{' '}
                  of{' '}
                  <span className="font-semibold text-slate-800">
                    {reviews.length}
                  </span>{' '}
                  reviews
                </p>

                {(searchTerm ||
                  statusFilter !== 'ALL' ||
                  ratingFilter !== 'ALL') && (

                  <button
                    onClick={clearFilters}
                    className="text-sm font-semibold text-slate-600 hover:text-slate-900"
                  >
                    Clear Filters
                  </button>

                )}

              </div>

            </div>

            {/* ==========================================
                LOADING
            ========================================== */}

            {loading && (
              <div className="p-12 text-center">

                <div className="text-4xl mb-4">
                  ⏳
                </div>

                <p className="text-sm text-slate-500">
                  Loading reviews...
                </p>

              </div>
            )}

            {/* ==========================================
                EMPTY
            ========================================== */}

            {!loading &&
              !error &&
              reviews.length === 0 && (

              <div className="p-12 text-center">

                <div className="text-5xl mb-4">
                  ⭐
                </div>

                <h4 className="font-semibold text-slate-800">
                  No reviews yet
                </h4>

                <p className="text-sm text-slate-500 mt-1">
                  Customer reviews will appear here.
                </p>

              </div>
            )}

            {/* ==========================================
                NO FILTER RESULTS
            ========================================== */}

            {!loading &&
              !error &&
              reviews.length > 0 &&
              filteredReviews.length === 0 && (

              <div className="p-12 text-center">

                <div className="text-5xl mb-4">
                  🔍
                </div>

                <h4 className="font-semibold text-slate-800">
                  No matching reviews
                </h4>

                <p className="text-sm text-slate-500 mt-1">
                  Try changing your search or filters.
                </p>

                <button
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition"
                >
                  Clear Filters
                </button>

              </div>
            )}

            {/* ==========================================
                TABLE
            ========================================== */}

            {!loading &&
              filteredReviews.length > 0 && (

              <div className="overflow-x-auto">

                <table className="w-full min-w-[1000px]">

                  <thead className="bg-slate-50">

                    <tr>

                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">
                        Customer
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">
                        Rating
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">
                        Review
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">
                        Date
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">
                        Status
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">
                        Action
                      </th>

                    </tr>

                  </thead>

                  <tbody className="divide-y divide-slate-100">

                    {filteredReviews.map((review) => (

                      <tr
                        key={review.id}
                        className="hover:bg-slate-50 transition"
                      >

                        {/* CUSTOMER */}

                        <td className="px-6 py-5">

                          <p className="text-sm font-semibold text-slate-800">
                            {review.customerName || 'Unknown'}
                          </p>

                          <p className="text-xs text-slate-400 mt-1">
                            Review #{review.id}
                          </p>

                        </td>

                        {/* RATING */}

                        <td className="px-6 py-5">

                          {renderStars(review.rating)}

                          <p className="text-xs text-slate-500 mt-1">
                            {review.rating || 0}/5
                          </p>

                        </td>

                        {/* REVIEW */}

                        <td className="px-6 py-5 max-w-md">

                          <p
                            className="text-sm text-slate-700 truncate"
                            title={review.comment}
                          >
                            {review.comment || '-'}
                          </p>

                        </td>

                        {/* DATE */}

                        <td className="px-6 py-5 text-sm text-slate-600">
                          {formatDate(review.date)}
                        </td>

                        {/* STATUS */}

                        <td className="px-6 py-5">

                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${getStatusClasses(
                              review.status
                            )}`}
                          >
                            {review.status?.toUpperCase() ||
                              'PENDING'}
                          </span>

                        </td>

                        {/* ACTION */}

                        <td className="px-6 py-5">

                          <button
                            onClick={() =>
                              handleViewReview(review)
                            }
                            className="px-3 py-1.5 text-sm font-semibold text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-900 hover:text-white transition"
                          >
                            View
                          </button>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>
            )}

          </div>

        </div>

      </main>

      {/* ==========================================
          REVIEW MODAL
      ========================================== */}

      {showModal && selectedReview && (

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

          {/* OVERLAY */}

          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* MODAL */}

          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">

            {/* HEADER */}

            <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">

              <div>

                <p className="text-xs font-semibold text-slate-500 uppercase">
                  Customer Review
                </p>

                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  Review #{selectedReview.id}
                </h2>

              </div>

              <button
                onClick={closeModal}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 text-xl"
                aria-label="Close review"
              >
                ×
              </button>

            </div>

            {/* CONTENT */}

            <div className="p-6">

              {/* CUSTOMER */}

              <div className="bg-slate-50 rounded-xl p-4">

                <p className="text-xs text-slate-500">
                  Customer
                </p>

                <p className="text-sm font-semibold text-slate-800 mt-1">
                  {selectedReview.customerName || 'Unknown'}
                </p>

              </div>

              {/* RATING */}

              <div className="bg-slate-50 rounded-xl p-4 mt-4">

                <p className="text-xs text-slate-500">
                  Rating
                </p>

                <div className="flex items-center gap-3 mt-2">

                  {renderStars(
                    selectedReview.rating
                  )}

                  <span className="text-sm font-semibold text-slate-700">
                    {selectedReview.rating || 0}/5
                  </span>

                </div>

              </div>

              {/* DATE */}

              <div className="bg-slate-50 rounded-xl p-4 mt-4">

                <p className="text-xs text-slate-500">
                  Date
                </p>

                <p className="text-sm font-semibold text-slate-800 mt-1">
                  {formatDate(
                    selectedReview.date
                  )}
                </p>

              </div>

              {/* REVIEW */}

              <div className="bg-slate-50 rounded-xl p-4 mt-4">

                <p className="text-xs text-slate-500">
                  Review
                </p>

                <p className="text-sm text-slate-700 mt-2 leading-6 whitespace-pre-wrap">
                  {selectedReview.comment || '-'}
                </p>

              </div>

              {/* CURRENT STATUS */}

              <div className="mt-5">

                <p className="text-xs font-semibold text-slate-500 uppercase mb-2">
                  Current Status
                </p>

                <span
                  className={`inline-flex px-3 py-1.5 rounded-full text-xs font-bold ${getStatusClasses(
                    selectedReview.status
                  )}`}
                >
                  {selectedReview.status?.toUpperCase() ||
                    'PENDING'}
                </span>

              </div>

              {/* STATUS ACTIONS */}

              <div className="mt-6">

                <p className="text-xs font-semibold text-slate-500 uppercase mb-3">
                  Manage Review
                </p>

                <div className="flex flex-col sm:flex-row gap-3">

                  {/* PUBLISH */}

                  {selectedReview.status?.toUpperCase() !==
                    'PUBLISHED' && (

                    <button
                      onClick={() =>
                        handleStatusChange(
                          selectedReview,
                          'PUBLISHED'
                        )
                      }
                      disabled={
                        updatingId ===
                        selectedReview.id
                      }
                      className="flex-1 px-4 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {updatingId ===
                      selectedReview.id
                        ? 'Updating...'
                        : '✓ Publish Review'}
                    </button>

                  )}

                  {/* PENDING */}

                  {selectedReview.status?.toUpperCase() !==
                    'PENDING' && (

                    <button
                      onClick={() =>
                        handleStatusChange(
                          selectedReview,
                          'PENDING'
                        )
                      }
                      disabled={
                        updatingId ===
                        selectedReview.id
                      }
                      className="flex-1 px-4 py-3 rounded-lg bg-yellow-500 text-white font-semibold hover:bg-yellow-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {updatingId ===
                      selectedReview.id
                        ? 'Updating...'
                        : '⏳ Move to Pending'}
                    </button>

                  )}

                </div>

              </div>

            </div>

            {/* FOOTER */}

            <div className="px-6 py-5 border-t border-slate-200 bg-slate-50">

              <div className="flex gap-3">

                {/* DELETE */}

                <button
                  onClick={() =>
                    handleDeleteReview(
                      selectedReview
                    )
                  }
                  disabled={
                    deletingId === selectedReview.id
                  }
                  className="flex-1 px-4 py-3 rounded-lg border border-red-300 text-red-600 font-semibold hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deletingId === selectedReview.id
                    ? 'Deleting...'
                    : '🗑 Delete Review'}
                </button>

                {/* CLOSE */}

                <button
                  onClick={closeModal}
                  disabled={
                    deletingId === selectedReview.id
                  }
                  className="flex-1 px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-700 font-semibold hover:bg-slate-100 transition"
                >
                  Close
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default ReviewsPage;