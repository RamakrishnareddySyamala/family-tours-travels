import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../constants/config';

function AdminPage() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ==========================================
  // AUTH HEADERS
  // ==========================================
  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');

    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  // Booking modal
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Status update
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Delete booking
  const [deletingBooking, setDeletingBooking] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  // ==========================================
  // FETCH ALL BOOKINGS
  // ==========================================
  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(
        `${API_URL}/api/bookings`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }

      const data = await response.json();

      setBookings(data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Unable to load bookings from the server.');
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // VIEW BOOKING
  // ==========================================
  const handleViewBooking = async (booking) => {
    try {
      const response = await fetch(
        `${API_URL}/api/bookings/${booking.id}`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch booking details');
      }

      const data = await response.json();

      setSelectedBooking(data);
      setShowBookingModal(true);
    } catch (err) {
      console.error('Error fetching booking details:', err);

      // Fallback to existing booking data
      setSelectedBooking(booking);
      setShowBookingModal(true);
    }
  };

  // ==========================================
  // CLOSE MODAL
  // ==========================================
  const closeBookingModal = () => {
    setSelectedBooking(null);
    setShowBookingModal(false);
  };

  // ==========================================
  // UPDATE BOOKING STATUS
  // ==========================================
  const updateBookingStatus = async (status) => {
    if (!selectedBooking) return;

    try {
      setUpdatingStatus(true);

      const response = await fetch(
       `${API_URL}/api/bookings/${selectedBooking.id}/status?status=${encodeURIComponent(
  
          status
        )}`,
        {
          method: 'PUT',
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update booking status');
      }

      const updatedBooking = await response.json();

      // Update selected booking inside modal
      setSelectedBooking(updatedBooking);

      // Update booking in dashboard list
      setBookings((previousBookings) =>
        previousBookings.map((booking) =>
          booking.id === updatedBooking.id
            ? updatedBooking
            : booking
        )
      );
    } catch (err) {
      console.error('Error updating booking status:', err);
      alert('Unable to update booking status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  // ==========================================
  // DELETE BOOKING
  // ==========================================
  const handleDeleteBooking = async () => {
    if (!selectedBooking) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete booking #${selectedBooking.id}?`
    );

    if (!confirmed) return;

    try {
      setDeletingBooking(true);

      const response = await fetch(
       `${API_URL}/api/bookings/${selectedBooking.id}`,
        {
          method: 'DELETE',
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete booking');
      }

      // Remove booking from dashboard
      setBookings((previousBookings) =>
        previousBookings.filter(
          (booking) => booking.id !== selectedBooking.id
        )
      );

      closeBookingModal();
    } catch (err) {
      console.error('Error deleting booking:', err);
      alert('Unable to delete booking.');
    } finally {
      setDeletingBooking(false);
    }
  };

  // ==========================================
  // DASHBOARD STATISTICS
  // ==========================================
  const totalBookings = bookings.length;

  const pendingBookings = bookings.filter(
    (booking) =>
      booking.status?.toUpperCase() === 'PENDING'
  ).length;

  const confirmedBookings = bookings.filter(
    (booking) =>
      booking.status?.toUpperCase() === 'CONFIRMED'
  ).length;

  const rejectedBookings = bookings.filter(
    (booking) =>
      booking.status?.toUpperCase() === 'REJECTED'
  ).length;

  // Unique customers using mobile number
  const uniqueCustomers = new Set(
    bookings
      .map((booking) => booking.mobileNumber)
      .filter(Boolean)
  ).size;

  const stats = [
    {
      title: 'Total Bookings',
      value: totalBookings,
      icon: '📅',
      description: 'All booking requests',
    },
    {
      title: 'Pending',
      value: pendingBookings,
      icon: '⏳',
      description: 'Waiting for confirmation',
    },
    {
      title: 'Confirmed',
      value: confirmedBookings,
      icon: '✅',
      description: 'Confirmed bookings',
    },
    {
      title: 'Customers',
      value: uniqueCustomers,
      icon: '👥',
      description: 'Unique customers',
    },
  ];

  // ==========================================
  // STATUS BADGE
  // ==========================================
  const getStatusClasses = (status) => {
    const normalizedStatus = status?.toUpperCase();

    if (normalizedStatus === 'CONFIRMED') {
      return 'bg-green-100 text-green-700';
    }

    if (normalizedStatus === 'REJECTED') {
      return 'bg-red-100 text-red-700';
    }

    return 'bg-yellow-100 text-yellow-700';
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================
  const formatDate = (date) => {
    if (!date) return '-';

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

  return (
    <div className="min-h-screen bg-slate-100 flex">

      {/* ==========================================
          SIDEBAR
      ========================================== */}
      <aside className="hidden md:flex w-64 bg-slate-950 text-white flex-col">

        {/* Logo */}
        <div className="px-6 py-6 border-b border-slate-800">
          <h1 className="text-xl font-bold">
            Family Tours
          </h1>

          <p className="text-sm text-slate-400 mt-1">
            Admin Panel
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">

          <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-white/10 text-white text-left"
          >
            <span>📊</span>
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => navigate('/admin/bookings')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition text-left"
          >
            <span>📅</span>
            <span>Bookings</span>
          </button>

          <button
            onClick={() => navigate('/admin/tour-packages')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition text-left"
          >
            <span>🧳</span>
            <span>Tour Packages</span>
          </button>

          <button
            onClick={() => navigate('/admin/vehicles')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition text-left"
          >
            <span>🚗</span>
            <span>Vehicles</span>
          </button>

          <button
            onClick={() => navigate('/admin/customers')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition text-left"
          >
            <span>👥</span>
            <span>Customers</span>
          </button>

          <button
            onClick={() => navigate('/admin/reviews')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition text-left"
          >
            <span>⭐</span>
            <span>Reviews</span>
          </button>

        </nav>

        {/* Bottom Navigation */}
        <div className="px-4 py-5 border-t border-slate-800">

          <button
            onClick={() => navigate('/admin/settings')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition text-left"
          >
            <span>⚙️</span>
            <span>Settings</span>
          </button>

          <button
            onClick={() => navigate('/admin/logout')}
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
        <header className="bg-white border-b border-slate-200 px-6 md:px-8 py-5 flex items-center justify-between">

          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Dashboard
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Welcome back, Admin
            </p>
          </div>

          <div className="flex items-center gap-3">

            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-slate-800">
                Administrator
              </p>

              <p className="text-xs text-slate-500">
                Family Tours & Travels
              </p>
            </div>

            <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">
              A
            </div>

          </div>

        </header>

        {/* DASHBOARD CONTENT */}
        <div className="p-6 md:p-8">

          {/* Loading */}
          {loading && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6">
              <p className="text-slate-600">
                Loading bookings...
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">

              <p className="text-red-600 font-medium">
                {error}
              </p>

              <button
                onClick={fetchBookings}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700"
              >
                Try Again
              </button>

            </div>
          )}

          {/* STATISTICS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

            {stats.map((stat) => (
              <div
                key={stat.title}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm"
              >

                <div className="flex items-start justify-between">

                  <div>
                    <p className="text-sm text-slate-500">
                      {stat.title}
                    </p>

                    <h3 className="text-3xl font-bold text-slate-900 mt-2">
                      {stat.value}
                    </h3>
                  </div>

                  <div className="w-11 h-11 rounded-lg bg-slate-100 flex items-center justify-center text-xl">
                    {stat.icon}
                  </div>

                </div>

                <p className="text-xs text-slate-500 mt-4">
                  {stat.description}
                </p>

              </div>
            ))}

          </div>

          {/* EXTRA STATUS SUMMARY */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-5 py-4">
              <p className="text-xs font-semibold text-yellow-700 uppercase">
                Pending Requests
              </p>

              <p className="text-2xl font-bold text-yellow-800 mt-1">
                {pendingBookings}
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-4">
              <p className="text-xs font-semibold text-green-700 uppercase">
                Confirmed
              </p>

              <p className="text-2xl font-bold text-green-800 mt-1">
                {confirmedBookings}
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4">
              <p className="text-xs font-semibold text-red-700 uppercase">
                Rejected
              </p>

              <p className="text-2xl font-bold text-red-800 mt-1">
                {rejectedBookings}
              </p>
            </div>

          </div>

          {/* RECENT BOOKINGS */}
          <div
            id="recent-bookings"
            className="mt-8 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
          >

            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">

              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Recent Bookings
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Latest booking requests from customers
                </p>
              </div>

              <button
                onClick={fetchBookings}
                disabled={loading}
                className="text-sm font-semibold text-slate-900 hover:underline disabled:opacity-50"
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>

            </div>

            {/* Table */}
            <div className="overflow-x-auto">

              {bookings.length === 0 && !loading ? (

                <div className="p-10 text-center">

                  <div className="text-4xl mb-3">
                    📭
                  </div>

                  <h4 className="font-semibold text-slate-800">
                    No bookings yet
                  </h4>

                  <p className="text-sm text-slate-500 mt-1">
                    Customer bookings will appear here.
                  </p>

                </div>

              ) : (

                <table className="w-full min-w-[950px]">

                  <thead className="bg-slate-50">

                    <tr>

                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">
                        Booking
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">
                        Customer
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">
                        Trip
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">
                        Date
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">
                        Passengers
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

                    {bookings.map((booking) => (

                      <tr
                        key={booking.id}
                        className="hover:bg-slate-50 transition"
                      >

                        {/* Booking ID */}
                        <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                          #{booking.id}
                        </td>

                        {/* Customer */}
                        <td className="px-6 py-4">

                          <p className="text-sm font-medium text-slate-800">
                            {booking.customerName}
                          </p>

                          <p className="text-xs text-slate-500 mt-1">
                            {booking.mobileNumber}
                          </p>

                        </td>

                        {/* Trip */}
                        <td className="px-6 py-4">

                          <p className="text-sm text-slate-700">
                            {booking.tripType}
                          </p>

                          <p className="text-xs text-slate-500 mt-1">
                            {booking.pickupLocation} → {booking.destination}
                          </p>

                        </td>

                        {/* Date */}
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {formatDate(booking.travelDate)}
                        </td>

                        {/* Passengers */}
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {booking.numberOfPassengers}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">

                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusClasses(
                              booking.status
                            )}`}
                          >
                            {booking.status || 'PENDING'}
                          </span>

                        </td>

                        {/* Action */}
                        <td className="px-6 py-4">

                          <button
                            onClick={() =>
                              handleViewBooking(booking)
                            }
                            className="px-3 py-1.5 text-sm font-semibold text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-900 hover:text-white transition"
                          >
                            View
                          </button>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              )}

            </div>

          </div>

        </div>

      </main>

      {/* ==========================================
          BOOKING DETAILS MODAL
      ========================================== */}
      {showBookingModal && selectedBooking && (

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

          {/* Background overlay */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeBookingModal}
          />

          {/* Modal */}
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">

            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">

              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">
                  Booking Details
                </p>

                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  Booking #{selectedBooking.id}
                </h2>
              </div>

              <button
                onClick={closeBookingModal}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 text-xl"
              >
                ×
              </button>

            </div>

            {/* Modal Content */}
            <div className="p-6">

              {/* Current Status */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">

                <p className="text-xs font-semibold text-slate-500 uppercase">
                  Current Status
                </p>

                <div className="flex items-center gap-3 mt-3">

                  <span
                    className={`inline-flex px-4 py-2 rounded-full text-sm font-bold ${getStatusClasses(
                      selectedBooking.status
                    )}`}
                  >
                    {selectedBooking.status || 'PENDING'}
                  </span>

                </div>

              </div>

              {/* Customer Information */}
              <div className="mt-6">

                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Customer Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">

                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs text-slate-500">
                      Customer Name
                    </p>

                    <p className="text-sm font-semibold text-slate-800 mt-1">
                      {selectedBooking.customerName || '-'}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs text-slate-500">
                      Mobile Number
                    </p>

                    <p className="text-sm font-semibold text-slate-800 mt-1">
                      {selectedBooking.mobileNumber || '-'}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4 sm:col-span-2">
                    <p className="text-xs text-slate-500">
                      Email
                    </p>

                    <p className="text-sm font-semibold text-slate-800 mt-1">
                      {selectedBooking.email || 'Not provided'}
                    </p>
                  </div>

                </div>

              </div>

              {/* Trip Information */}
              <div className="mt-6">

                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Trip Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">

                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs text-slate-500">
                      Trip Type
                    </p>

                    <p className="text-sm font-semibold text-slate-800 mt-1">
                      {selectedBooking.tripType || '-'}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs text-slate-500">
                      Travel Date
                    </p>

                    <p className="text-sm font-semibold text-slate-800 mt-1">
                      {formatDate(selectedBooking.travelDate)}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs text-slate-500">
                      Pickup Location
                    </p>

                    <p className="text-sm font-semibold text-slate-800 mt-1">
                      {selectedBooking.pickupLocation || '-'}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs text-slate-500">
                      Destination
                    </p>

                    <p className="text-sm font-semibold text-slate-800 mt-1">
                      {selectedBooking.destination || '-'}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs text-slate-500">
                      Number of Passengers
                    </p>

                    <p className="text-sm font-semibold text-slate-800 mt-1">
                      {selectedBooking.numberOfPassengers || '-'}
                    </p>
                  </div>

                </div>

              </div>

              {/* Additional Information */}
              <div className="mt-6">

                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Additional Information
                </h3>

                <div className="mt-4 bg-slate-50 rounded-xl p-4">

                  <p className="text-sm text-slate-700 whitespace-pre-wrap">
                    {selectedBooking.message ||
                      'No additional message provided.'}
                  </p>

                </div>

              </div>

            </div>

            {/* Modal Footer / Actions */}
            <div className="px-6 py-5 border-t border-slate-200 bg-slate-50">

              <div className="flex flex-col sm:flex-row gap-3">

                {/* Confirm */}
                <button
                  onClick={() =>
                    updateBookingStatus('CONFIRMED')
                  }
                  disabled={
                    updatingStatus ||
                    selectedBooking.status?.toUpperCase() ===
                      'CONFIRMED'
                  }
                  className="flex-1 px-4 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updatingStatus
                    ? 'Updating...'
                    : '✓ Confirm Booking'}
                </button>

                {/* Reject */}
                <button
                  onClick={() =>
                    updateBookingStatus('REJECTED')
                  }
                  disabled={
                    updatingStatus ||
                    selectedBooking.status?.toUpperCase() ===
                      'REJECTED'
                  }
                  className="flex-1 px-4 py-3 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updatingStatus
                    ? 'Updating...'
                    : '✕ Reject Booking'}
                </button>

                {/* Delete */}
                <button
                  onClick={handleDeleteBooking}
                  disabled={deletingBooking}
                  className="px-4 py-3 rounded-lg border border-red-300 text-red-600 font-semibold hover:bg-red-50 transition disabled:opacity-50"
                >
                  {deletingBooking
                    ? 'Deleting...'
                    : 'Delete'}
                </button>

              </div>

              <button
                onClick={closeBookingModal}
                className="w-full mt-3 px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-700 font-semibold hover:bg-slate-100 transition"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default AdminPage;