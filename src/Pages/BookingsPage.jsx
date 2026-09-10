import React, {
  useEffect,
  useMemo,
  useState
} from 'react';

import { useNavigate } from 'react-router-dom';
import { API_URL } from '../constants/config';

function BookingsPage() {

    const navigate = useNavigate();

    const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken');

  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const [updatingStatus, setUpdatingStatus] = useState(false);

  // =========================================================
  // FETCH BOOKINGS
  // =========================================================

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);

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
      setError('');
    } catch (err) {
      console.error('Error fetching bookings:', err);

      setError(
        'Unable to load bookings from the server.'
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date) => {
    if (!date) return '—';

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // =========================================================
  // STATUS CLASSES
  // =========================================================

  const getStatusClasses = (status) => {
    switch (status?.toUpperCase()) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-700';

      case 'REJECTED':
        return 'bg-red-100 text-red-700';

      case 'PENDING':
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  // =========================================================
  // FILTER BOOKINGS
  // =========================================================

  const filteredBookings = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return bookings.filter((booking) => {
      const matchesStatus =
        statusFilter === 'ALL' ||
        booking.status?.toUpperCase() === statusFilter;

      const matchesSearch =
        !search ||
        booking.customerName
          ?.toLowerCase()
          .includes(search) ||
        booking.mobileNumber
          ?.toLowerCase()
          .includes(search) ||
        booking.pickupLocation
          ?.toLowerCase()
          .includes(search) ||
        booking.destination
          ?.toLowerCase()
          .includes(search) ||
        booking.tripType
          ?.toLowerCase()
          .includes(search) ||
        String(booking.id).includes(search);

      return matchesStatus && matchesSearch;
    });
  }, [bookings, searchTerm, statusFilter]);

  // =========================================================
  // COUNTS
  // =========================================================

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

  // =========================================================
  // VIEW BOOKING
  // =========================================================

  const handleViewBooking = async (booking) => {
    try {
      const response = await fetch(
  `${API_URL}/api/bookings/${booking.id}`,
  {
    headers: getAuthHeaders(),
  }
);

      if (!response.ok) {
        throw new Error(
          'Failed to fetch booking details'
        );
      }

      const latestBooking = await response.json();

      setSelectedBooking(latestBooking);
      setShowBookingModal(true);
    } catch (err) {
      console.error(
        'Error fetching booking details:',
        err
      );

      // Fallback to table data
      setSelectedBooking(booking);
      setShowBookingModal(true);
    }
  };

  // =========================================================
  // CLOSE MODAL
  // =========================================================

  const closeBookingModal = () => {
    if (updatingStatus) return;

    setSelectedBooking(null);
    setShowBookingModal(false);
  };

  // =========================================================
  // UPDATE STATUS
  // =========================================================

  const updateBookingStatus = async (status) => {
    if (!selectedBooking) return;

    try {
      setUpdatingStatus(true);

      const response = await fetch(
        `${API_URL}/api/bookings/${selectedBooking.id}/status?status=${status}`,
        {
          
  method: 'PUT',
  headers: getAuthHeaders(),
}
        
      );

      if (!response.ok) {
        throw new Error(
          'Failed to update booking status'
        );
      }

      const updatedBooking =
        await response.json();

      // Update selected booking
      setSelectedBooking(updatedBooking);

      // Update table
      setBookings((currentBookings) =>
        currentBookings.map((booking) =>
          booking.id === updatedBooking.id
            ? updatedBooking
            : booking
        )
      );

      setError('');
    } catch (err) {
      console.error(
        'Error updating booking status:',
        err
      );

      setError(
        'Unable to update booking status.'
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  // =========================================================
  // DELETE BOOKING
  // =========================================================

  const deleteBooking = async () => {
    if (!selectedBooking) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete Booking #${selectedBooking.id}?`
    );

    if (!confirmed) return;

    try {
      setUpdatingStatus(true);

      const response = await fetch(
        `${API_URL}/api/bookings/${selectedBooking.id}`,
        {
          
  method: 'DELETE',
  headers: getAuthHeaders(),
}
        
      );

      if (!response.ok) {
        throw new Error(
          'Failed to delete booking'
        );
      }

      setBookings((currentBookings) =>
        currentBookings.filter(
          (booking) =>
            booking.id !== selectedBooking.id
        )
      );

      setSelectedBooking(null);
      setShowBookingModal(false);
    } catch (err) {
      console.error(
        'Error deleting booking:',
        err
      );

      setError(
        'Unable to delete booking.'
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen bg-slate-100">

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <header className="bg-white border-b border-slate-200">

  <div className="px-6 md:px-8 py-6">

    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

      {/* PAGE TITLE */}

      <div>

        <h1 className="text-2xl font-bold text-slate-900">
          Bookings
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Manage customer booking requests
        </p>

      </div>


      {/* HEADER BUTTONS */}

      <div className="flex flex-wrap items-center gap-3">

        {/* BACK TO DASHBOARD */}

        <button
          onClick={() => navigate('/admin')}
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            px-4
            py-2.5
            rounded-lg
            border
            border-slate-200
            bg-white
            text-slate-700
            text-sm
            font-semibold
            hover:bg-slate-50
            transition
          "
        >
          ← Dashboard
        </button>


        {/* REFRESH */}

        <button
          onClick={fetchBookings}
          disabled={loading}
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            px-4
            py-2.5
            rounded-lg
            bg-slate-900
            text-white
            text-sm
            font-semibold
            hover:bg-slate-800
            transition
            disabled:opacity-50
          "
        >
          🔄
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>

      </div>

    </div>

  </div>

</header>


      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <main className="p-6 md:p-8">

        {/* ===================================================
            ERROR
        ==================================================== */}

        {error && (

          <div
            className="
              mb-6
              bg-red-50
              border border-red-200
              rounded-xl
              px-5 py-4
              flex items-center justify-between
              gap-4
            "
          >

            <p className="text-sm font-medium text-red-600">
              {error}
            </p>

            <button
              onClick={() => setError('')}
              className="text-red-500 font-bold"
            >
              ✕
            </button>

          </div>

        )}


        {/* ===================================================
            SUMMARY CARDS
        ==================================================== */}

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            gap-5
            mb-8
          "
        >

          {/* Total */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Total Bookings
                </p>

                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {totalBookings}
                </p>

              </div>

              <div className="w-11 h-11 rounded-lg bg-slate-100 flex items-center justify-center text-xl">
                📅
              </div>

            </div>

          </div>


          {/* Pending */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Pending
                </p>

                <p className="text-3xl font-bold text-yellow-600 mt-2">
                  {pendingBookings}
                </p>

              </div>

              <div className="w-11 h-11 rounded-lg bg-yellow-50 flex items-center justify-center text-xl">
                ⏳
              </div>

            </div>

          </div>


          {/* Confirmed */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Confirmed
                </p>

                <p className="text-3xl font-bold text-green-600 mt-2">
                  {confirmedBookings}
                </p>

              </div>

              <div className="w-11 h-11 rounded-lg bg-green-50 flex items-center justify-center text-xl">
                ✅
              </div>

            </div>

          </div>


          {/* Rejected */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Rejected
                </p>

                <p className="text-3xl font-bold text-red-600 mt-2">
                  {rejectedBookings}
                </p>

              </div>

              <div className="w-11 h-11 rounded-lg bg-red-50 flex items-center justify-center text-xl">
                ❌
              </div>

            </div>

          </div>

        </div>


        {/* ===================================================
            FILTER BAR
        ==================================================== */}

        <div
          className="
            bg-white
            border border-slate-200
            rounded-xl
            shadow-sm
            p-5
            mb-6
          "
        >

          <div className="flex flex-col lg:flex-row gap-4">

            {/* Search */}
            <div className="flex-1">

              <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">
                Search Bookings
              </label>

              <div className="relative">

                <span
                  className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                >
                  🔎
                </span>

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(
                      event.target.value
                    )
                  }
                  placeholder="Search by name, mobile, pickup, destination..."
                  className="
                    w-full
                    border border-slate-200
                    rounded-lg
                    pl-10 pr-4
                    py-2.5
                    text-sm
                    text-slate-800
                    outline-none
                    focus:border-slate-400
                    focus:ring-2
                    focus:ring-slate-100
                  "
                />

              </div>

            </div>


            {/* Status */}
            <div className="w-full lg:w-56">

              <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">
                Status
              </label>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value
                  )
                }
                className="
                  w-full
                  border border-slate-200
                  rounded-lg
                  px-4 py-2.5
                  text-sm
                  text-slate-800
                  bg-white
                  outline-none
                  focus:border-slate-400
                  focus:ring-2
                  focus:ring-slate-100
                "
              >

                <option value="ALL">
                  All Statuses
                </option>

                <option value="PENDING">
                  Pending
                </option>

                <option value="CONFIRMED">
                  Confirmed
                </option>

                <option value="REJECTED">
                  Rejected
                </option>

              </select>

            </div>

          </div>


          {/* Results */}
          <div className="mt-4 text-sm text-slate-500">

            Showing{' '}
            <span className="font-semibold text-slate-800">
              {filteredBookings.length}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-slate-800">
              {totalBookings}
            </span>{' '}
            bookings

          </div>

        </div>


        {/* ===================================================
            BOOKINGS TABLE
        ==================================================== */}

        <div
          className="
            bg-white
            border border-slate-200
            rounded-xl
            shadow-sm
            overflow-hidden
          "
        >

          <div className="overflow-x-auto">

            {loading ? (

              <div className="p-12 text-center">

                <div className="text-3xl mb-3">
                  ⏳
                </div>

                <p className="text-sm text-slate-500">
                  Loading bookings...
                </p>

              </div>

            ) : filteredBookings.length === 0 ? (

              <div className="p-12 text-center">

                <div className="text-4xl mb-3">
                  📭
                </div>

                <h3 className="font-semibold text-slate-800">
                  No bookings found
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Try changing your search or status filter.
                </p>

              </div>

            ) : (

              <table className="w-full min-w-[1050px]">

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
                      Travel Date
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

                  {filteredBookings.map((booking) => (

                    <tr
                      key={booking.id}
                      className="hover:bg-slate-50 transition"
                    >

                      {/* Booking */}
                      <td className="px-6 py-4">

                        <span className="font-semibold text-sm text-slate-800">
                          #{booking.id}
                        </span>

                      </td>


                      {/* Customer */}
                      <td className="px-6 py-4">

                        <p className="text-sm font-semibold text-slate-800">
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
                          {booking.pickupLocation} →{' '}
                          {booking.destination}
                        </p>

                      </td>


                      {/* Date */}
                      <td className="px-6 py-4">

                        <p className="text-sm text-slate-700">
                          {formatDate(
                            booking.travelDate
                          )}
                        </p>

                      </td>


                      {/* Passengers */}
                      <td className="px-6 py-4">

                        <span className="text-sm text-slate-600">
                          {booking.numberOfPassengers}
                        </span>

                      </td>


                      {/* Status */}
                      <td className="px-6 py-4">

                        <span
                          className={`
                            inline-flex
                            px-3 py-1
                            rounded-full
                            text-xs
                            font-semibold
                            ${getStatusClasses(
                              booking.status
                            )}
                          `}
                        >
                          {booking.status}
                        </span>

                      </td>


                      {/* Action */}
                      <td className="px-6 py-4">

                        <button
                          onClick={() =>
                            handleViewBooking(
                              booking
                            )
                          }
                          className="
                            px-3 py-1.5
                            rounded-lg
                            border border-slate-200
                            text-sm
                            font-semibold
                            text-slate-700
                            hover:bg-slate-100
                            transition
                          "
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

      </main>


      {/* =====================================================
          BOOKING DETAILS MODAL
      ====================================================== */}

      {showBookingModal &&
        selectedBooking && (

          <div
            className="
              fixed inset-0
              z-50
              bg-black/50
              flex
              items-center
              justify-center
              p-4
            "
            onClick={closeBookingModal}
          >

            <div
              className="
                bg-white
                w-full
                max-w-2xl
                max-h-[90vh]
                overflow-y-auto
                rounded-2xl
                shadow-2xl
              "
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              {/* Header */}
              <div
                className="
                  px-6 py-5
                  border-b border-slate-200
                  flex items-center justify-between
                "
              >

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
                  disabled={updatingStatus}
                  className="
                    w-9 h-9
                    rounded-full
                    bg-slate-100
                    hover:bg-slate-200
                    text-slate-600
                  "
                >
                  ✕
                </button>

              </div>


              {/* Body */}
              <div className="p-6 space-y-6">

                {/* Status */}
                <div>

                  <p className="text-sm text-slate-500 mb-2">
                    Current Status
                  </p>

                  <span
                    className={`
                      inline-flex
                      px-4 py-2
                      rounded-full
                      text-sm
                      font-bold
                      ${getStatusClasses(
                        selectedBooking.status
                      )}
                    `}
                  >
                    {selectedBooking.status}
                  </span>

                </div>


                {/* Customer */}
                <div>

                  <h3 className="text-sm font-bold text-slate-900 mb-4">
                    Customer Information
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <div>

                      <p className="text-xs text-slate-500">
                        Customer Name
                      </p>

                      <p className="text-sm font-semibold text-slate-800 mt-1">
                        {selectedBooking.customerName ||
                          '—'}
                      </p>

                    </div>


                    <div>

                      <p className="text-xs text-slate-500">
                        Mobile Number
                      </p>

                      <p className="text-sm font-semibold text-slate-800 mt-1">
                        {selectedBooking.mobileNumber ||
                          '—'}
                      </p>

                    </div>


                    <div className="sm:col-span-2">

                      <p className="text-xs text-slate-500">
                        Email
                      </p>

                      <p className="text-sm font-semibold text-slate-800 mt-1 break-all">
                        {selectedBooking.email ||
                          'Not provided'}
                      </p>

                    </div>

                  </div>

                </div>


                {/* Trip */}
                <div>

                  <h3 className="text-sm font-bold text-slate-900 mb-4">
                    Trip Information
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <div>

                      <p className="text-xs text-slate-500">
                        Trip Type
                      </p>

                      <p className="text-sm font-semibold text-slate-800 mt-1">
                        {selectedBooking.tripType ||
                          '—'}
                      </p>

                    </div>


                    <div>

                      <p className="text-xs text-slate-500">
                        Travel Date
                      </p>

                      <p className="text-sm font-semibold text-slate-800 mt-1">
                        {formatDate(
                          selectedBooking.travelDate
                        )}
                      </p>

                    </div>


                    <div>

                      <p className="text-xs text-slate-500">
                        Pickup Location
                      </p>

                      <p className="text-sm font-semibold text-slate-800 mt-1">
                        {selectedBooking.pickupLocation ||
                          '—'}
                      </p>

                    </div>


                    <div>

                      <p className="text-xs text-slate-500">
                        Destination
                      </p>

                      <p className="text-sm font-semibold text-slate-800 mt-1">
                        {selectedBooking.destination ||
                          '—'}
                      </p>

                    </div>


                    <div>

                      <p className="text-xs text-slate-500">
                        Number of Passengers
                      </p>

                      <p className="text-sm font-semibold text-slate-800 mt-1">
                        {selectedBooking.numberOfPassengers ||
                          '—'}
                      </p>

                    </div>

                  </div>

                </div>


                {/* Message */}
                <div>

                  <h3 className="text-sm font-bold text-slate-900 mb-3">
                    Additional Information
                  </h3>

                  <div
                    className="
                      bg-slate-50
                      border border-slate-200
                      rounded-lg
                      p-4
                    "
                  >

                    <p className="text-sm text-slate-700 whitespace-pre-wrap">
                      {selectedBooking.message ||
                        'No additional message provided.'}
                    </p>

                  </div>

                </div>

              </div>


              {/* Footer */}
              <div
                className="
                  px-6 py-5
                  border-t border-slate-200
                  flex flex-wrap
                  items-center
                  justify-between
                  gap-3
                "
              >

                {/* Delete */}
                <button
                  onClick={deleteBooking}
                  disabled={updatingStatus}
                  className="
                    px-4 py-2.5
                    rounded-lg
                    border border-red-200
                    text-red-600
                    font-semibold
                    text-sm
                    hover:bg-red-50
                    disabled:opacity-50
                  "
                >
                  🗑 Delete
                </button>


                <div className="flex gap-3">

                  {/* Reject */}
                  {selectedBooking.status?.toUpperCase() !==
                    'REJECTED' && (

                    <button
                      onClick={() =>
                        updateBookingStatus(
                          'REJECTED'
                        )
                      }
                      disabled={updatingStatus}
                      className="
                        px-4 py-2.5
                        rounded-lg
                        border border-red-200
                        text-red-600
                        font-semibold
                        text-sm
                        hover:bg-red-50
                        disabled:opacity-50
                      "
                    >
                      ❌ Reject
                    </button>

                  )}


                  {/* Confirm */}
                  {selectedBooking.status?.toUpperCase() !==
                    'CONFIRMED' && (

                    <button
                      onClick={() =>
                        updateBookingStatus(
                          'CONFIRMED'
                        )
                      }
                      disabled={updatingStatus}
                      className="
                        px-4 py-2.5
                        rounded-lg
                        bg-green-600
                        text-white
                        font-semibold
                        text-sm
                        hover:bg-green-700
                        disabled:opacity-50
                      "
                    >
                      {updatingStatus
                        ? 'Updating...'
                        : '✅ Confirm Booking'}
                    </button>

                  )}

                </div>

              </div>

            </div>

          </div>

        )}

    </div>
  );
}

export default BookingsPage;