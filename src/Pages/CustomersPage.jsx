
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../constants/config';

function CustomersPage() {
  const navigate = useNavigate();

  // =========================================================
  // AUTH HEADERS
  // =========================================================

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
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);

  // =========================================================
  // FETCH BOOKINGS
  // =========================================================

  useEffect(() => {
    fetchBookings();
  }, []);

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

      setError(
        'Unable to load customer information from the server.'
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // CREATE UNIQUE CUSTOMERS FROM BOOKINGS
  // =========================================================

  const customers = useMemo(() => {
    const customerMap = new Map();

    bookings.forEach((booking) => {
      const mobile = booking.mobileNumber?.trim();

      if (!mobile) return;

      if (!customerMap.has(mobile)) {
        customerMap.set(mobile, {
          mobileNumber: mobile,
          customerName:
            booking.customerName || 'Unknown Customer',
          email: booking.email || '',
          bookings: [],
        });
      }

      const customer = customerMap.get(mobile);

      customer.bookings.push(booking);

      // Keep available customer information updated
      if (!customer.email && booking.email) {
        customer.email = booking.email;
      }

      if (
        customer.customerName === 'Unknown Customer' &&
        booking.customerName
      ) {
        customer.customerName = booking.customerName;
      }
    });

    return Array.from(customerMap.values()).map(
      (customer) => {
        const confirmedBookings =
          customer.bookings.filter(
            (booking) =>
              booking.status?.toUpperCase() ===
              'CONFIRMED'
          ).length;

        const pendingBookings =
          customer.bookings.filter(
            (booking) =>
              booking.status?.toUpperCase() ===
              'PENDING'
          ).length;

        const rejectedBookings =
          customer.bookings.filter(
            (booking) =>
              booking.status?.toUpperCase() ===
              'REJECTED'
          ).length;

        return {
          ...customer,
          totalBookings: customer.bookings.length,
          confirmedBookings,
          pendingBookings,
          rejectedBookings,
        };
      }
    );
  }, [bookings]);

  // =========================================================
  // FILTER CUSTOMERS
  // =========================================================

  const filteredCustomers = useMemo(() => {
    const search = searchTerm
      .toLowerCase()
      .trim();

    if (!search) {
      return customers;
    }

    return customers.filter((customer) => {
      return (
        customer.customerName
          ?.toLowerCase()
          .includes(search) ||
        customer.mobileNumber
          ?.toLowerCase()
          .includes(search) ||
        customer.email
          ?.toLowerCase()
          .includes(search)
      );
    });
  }, [customers, searchTerm]);

  // =========================================================
  // STATISTICS
  // =========================================================

  const totalCustomers = customers.length;

  const totalBookings = bookings.length;

  const confirmedBookings = bookings.filter(
    (booking) =>
      booking.status?.toUpperCase() ===
      'CONFIRMED'
  ).length;

  const pendingBookings = bookings.filter(
    (booking) =>
      booking.status?.toUpperCase() ===
      'PENDING'
  ).length;

  // =========================================================
  // VIEW CUSTOMER
  // =========================================================

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowCustomerModal(true);
  };

  // =========================================================
  // CLOSE MODAL
  // =========================================================

  const closeCustomerModal = () => {
    setSelectedCustomer(null);
    setShowCustomerModal(false);
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

    return parsedDate.toLocaleDateString(
      'en-GB',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }
    );
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
  // UI
  // =========================================================

  return (
    <div className="min-h-screen bg-slate-100">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="bg-white border-b border-slate-200">

        <div className="px-6 md:px-8 py-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            {/* TITLE */}

            <div>

              <h1 className="text-2xl font-bold text-slate-900">
                Customers
              </h1>

              <p className="text-sm text-slate-500 mt-1">
                Manage customer information and booking history
              </p>

            </div>

            {/* ACTIONS */}

            <div className="flex items-center gap-3">

              <button
                onClick={() => navigate('/admin')}
                className="
                  px-4 py-2.5
                  rounded-lg
                  border border-slate-200
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

              <button
                onClick={fetchBookings}
                disabled={loading}
                className="
                  px-4 py-2.5
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
                🔄 {loading ? 'Refreshing...' : 'Refresh'}
              </button>

            </div>

          </div>

        </div>

      </header>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="p-6 md:p-8">

        {/* ERROR */}

        {error && (

          <div className="
            mb-6
            bg-red-50
            border border-red-200
            rounded-xl
            px-5 py-4
            flex items-center justify-between
          ">

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

        <div className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-4
          gap-5
          mb-8
        ">

          {/* TOTAL CUSTOMERS */}

          <div className="
            bg-white
            rounded-xl
            border border-slate-200
            p-5
            shadow-sm
          ">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Total Customers
                </p>

                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {totalCustomers}
                </p>

              </div>

              <div className="
                w-11 h-11
                rounded-lg
                bg-slate-100
                flex items-center justify-center
                text-xl
              ">
                👥
              </div>

            </div>

          </div>

          {/* TOTAL BOOKINGS */}

          <div className="
            bg-white
            rounded-xl
            border border-slate-200
            p-5
            shadow-sm
          ">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Total Bookings
                </p>

                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {totalBookings}
                </p>

              </div>

              <div className="
                w-11 h-11
                rounded-lg
                bg-slate-100
                flex items-center justify-center
                text-xl
              ">
                📅
              </div>

            </div>

          </div>

          {/* CONFIRMED */}

          <div className="
            bg-white
            rounded-xl
            border border-slate-200
            p-5
            shadow-sm
          ">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Confirmed Bookings
                </p>

                <p className="text-3xl font-bold text-green-600 mt-2">
                  {confirmedBookings}
                </p>

              </div>

              <div className="
                w-11 h-11
                rounded-lg
                bg-green-50
                flex items-center justify-center
                text-xl
              ">
                ✅
              </div>

            </div>

          </div>

          {/* PENDING */}

          <div className="
            bg-white
            rounded-xl
            border border-slate-200
            p-5
            shadow-sm
          ">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Pending Bookings
                </p>

                <p className="text-3xl font-bold text-yellow-600 mt-2">
                  {pendingBookings}
                </p>

              </div>

              <div className="
                w-11 h-11
                rounded-lg
                bg-yellow-50
                flex items-center justify-center
                text-xl
              ">
                ⏳
              </div>

            </div>

          </div>

        </div>

        {/* ===================================================
            SEARCH
        ==================================================== */}

        <div className="
          bg-white
          border border-slate-200
          rounded-xl
          shadow-sm
          p-5
          mb-6
        ">

          <label className="
            block
            text-xs
            font-semibold
            text-slate-500
            uppercase
            mb-2
          ">
            Search Customers
          </label>

          <div className="relative">

            <span className="
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              text-slate-400
            ">
              🔎
            </span>

            <input
              type="text"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Search by name, mobile number or email..."
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

          <p className="text-sm text-slate-500 mt-4">

            Showing{' '}
            <span className="font-semibold text-slate-800">
              {filteredCustomers.length}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-slate-800">
              {totalCustomers}
            </span>{' '}
            customers

          </p>

        </div>

        {/* ===================================================
            CUSTOMER TABLE
        ==================================================== */}

        <div className="
          bg-white
          border border-slate-200
          rounded-xl
          shadow-sm
          overflow-hidden
        ">

          <div className="overflow-x-auto">

            {loading ? (

              <div className="p-12 text-center">

                <div className="text-3xl mb-3">
                  ⏳
                </div>

                <p className="text-sm text-slate-500">
                  Loading customers...
                </p>

              </div>

            ) : filteredCustomers.length === 0 ? (

              <div className="p-12 text-center">

                <div className="text-4xl mb-3">
                  👥
                </div>

                <h3 className="font-semibold text-slate-800">
                  No customers found
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Try changing your search.
                </p>

              </div>

            ) : (

              <table className="w-full min-w-[950px]">

                <thead className="bg-slate-50">

                  <tr>

                    <th className="
                      px-6 py-4
                      text-left
                      text-xs
                      font-semibold
                      text-slate-500
                      uppercase
                    ">
                      Customer
                    </th>

                    <th className="
                      px-6 py-4
                      text-left
                      text-xs
                      font-semibold
                      text-slate-500
                      uppercase
                    ">
                      Mobile
                    </th>

                    <th className="
                      px-6 py-4
                      text-left
                      text-xs
                      font-semibold
                      text-slate-500
                      uppercase
                    ">
                      Email
                    </th>

                    <th className="
                      px-6 py-4
                      text-left
                      text-xs
                      font-semibold
                      text-slate-500
                      uppercase
                    ">
                      Bookings
                    </th>

                    <th className="
                      px-6 py-4
                      text-left
                      text-xs
                      font-semibold
                      text-slate-500
                      uppercase
                    ">
                      Confirmed
                    </th>

                    <th className="
                      px-6 py-4
                      text-left
                      text-xs
                      font-semibold
                      text-slate-500
                      uppercase
                    ">
                      Pending
                    </th>

                    <th className="
                      px-6 py-4
                      text-left
                      text-xs
                      font-semibold
                      text-slate-500
                      uppercase
                    ">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                  {filteredCustomers.map(
                    (customer) => (

                      <tr
                        key={customer.mobileNumber}
                        className="hover:bg-slate-50 transition"
                      >

                        {/* CUSTOMER */}

                        <td className="px-6 py-4">

                          <p className="
                            text-sm
                            font-semibold
                            text-slate-800
                          ">
                            {customer.customerName}
                          </p>

                        </td>

                        {/* MOBILE */}

                        <td className="px-6 py-4">

                          <p className="
                            text-sm
                            text-slate-700
                          ">
                            {customer.mobileNumber}
                          </p>

                        </td>

                        {/* EMAIL */}

                        <td className="px-6 py-4">

                          <p className="
                            text-sm
                            text-slate-600
                          ">
                            {customer.email ||
                              'Not provided'}
                          </p>

                        </td>

                        {/* TOTAL BOOKINGS */}

                        <td className="px-6 py-4">

                          <span className="
                            inline-flex
                            px-3 py-1
                            rounded-full
                            bg-slate-100
                            text-slate-700
                            text-xs
                            font-semibold
                          ">
                            {customer.totalBookings}
                          </span>

                        </td>

                        {/* CONFIRMED */}

                        <td className="px-6 py-4">

                          <span className="
                            inline-flex
                            px-3 py-1
                            rounded-full
                            bg-green-100
                            text-green-700
                            text-xs
                            font-semibold
                          ">
                            {customer.confirmedBookings}
                          </span>

                        </td>

                        {/* PENDING */}

                        <td className="px-6 py-4">

                          <span className="
                            inline-flex
                            px-3 py-1
                            rounded-full
                            bg-yellow-100
                            text-yellow-700
                            text-xs
                            font-semibold
                          ">
                            {customer.pendingBookings}
                          </span>

                        </td>

                        {/* ACTION */}

                        <td className="px-6 py-4">

                          <button
                            onClick={() =>
                              handleViewCustomer(
                                customer
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

                    )
                  )}

                </tbody>

              </table>

            )}

          </div>

        </div>

      </main>

      {/* =====================================================
          CUSTOMER DETAILS MODAL
      ====================================================== */}

      {showCustomerModal &&
        selectedCustomer && (

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
            onClick={closeCustomerModal}
          >

            <div
              className="
                bg-white
                w-full
                max-w-3xl
                max-h-[90vh]
                overflow-y-auto
                rounded-2xl
                shadow-2xl
              "
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              {/* HEADER */}

              <div className="
                px-6 py-5
                border-b border-slate-200
                flex items-center justify-between
              ">

                <div>

                  <p className="
                    text-xs
                    font-semibold
                    text-slate-500
                    uppercase
                  ">
                    Customer Details
                  </p>

                  <h2 className="
                    text-xl
                    font-bold
                    text-slate-900
                    mt-1
                  ">
                    {selectedCustomer.customerName}
                  </h2>

                </div>

                <button
                  onClick={closeCustomerModal}
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

              {/* CUSTOMER INFORMATION */}

              <div className="p-6">

                <div className="
                  grid
                  grid-cols-1
                  sm:grid-cols-2
                  gap-4
                ">

                  <div className="
                    bg-slate-50
                    rounded-xl
                    p-4
                  ">

                    <p className="text-xs text-slate-500">
                      Customer Name
                    </p>

                    <p className="
                      text-sm
                      font-semibold
                      text-slate-800
                      mt-1
                    ">
                      {selectedCustomer.customerName}
                    </p>

                  </div>

                  <div className="
                    bg-slate-50
                    rounded-xl
                    p-4
                  ">

                    <p className="text-xs text-slate-500">
                      Mobile Number
                    </p>

                    <p className="
                      text-sm
                      font-semibold
                      text-slate-800
                      mt-1
                    ">
                      {selectedCustomer.mobileNumber}
                    </p>

                  </div>

                  <div className="
                    bg-slate-50
                    rounded-xl
                    p-4
                    sm:col-span-2
                  ">

                    <p className="text-xs text-slate-500">
                      Email
                    </p>

                    <p className="
                      text-sm
                      font-semibold
                      text-slate-800
                      mt-1
                      break-all
                    ">
                      {selectedCustomer.email ||
                        'Not provided'}
                    </p>

                  </div>

                </div>

                {/* CUSTOMER STATS */}

                <div className="mt-6">

                  <h3 className="
                    text-sm
                    font-bold
                    text-slate-900
                    uppercase
                    tracking-wide
                    mb-4
                  ">
                    Booking Summary
                  </h3>

                  <div className="
                    grid
                    grid-cols-1
                    sm:grid-cols-3
                    gap-4
                  ">

                    <div className="
                      bg-slate-50
                      rounded-xl
                      p-4
                    ">

                      <p className="text-xs text-slate-500">
                        Total
                      </p>

                      <p className="
                        text-2xl
                        font-bold
                        text-slate-900
                        mt-1
                      ">
                        {selectedCustomer.totalBookings}
                      </p>

                    </div>

                    <div className="
                      bg-green-50
                      rounded-xl
                      p-4
                    ">

                      <p className="text-xs text-green-600">
                        Confirmed
                      </p>

                      <p className="
                        text-2xl
                        font-bold
                        text-green-700
                        mt-1
                      ">
                        {selectedCustomer.confirmedBookings}
                      </p>

                    </div>

                    <div className="
                      bg-yellow-50
                      rounded-xl
                      p-4
                    ">

                      <p className="text-xs text-yellow-600">
                        Pending
                      </p>

                      <p className="
                        text-2xl
                        font-bold
                        text-yellow-700
                        mt-1
                      ">
                        {selectedCustomer.pendingBookings}
                      </p>

                    </div>

                  </div>

                </div>

                {/* BOOKING HISTORY */}

                <div className="mt-6">

                  <h3 className="
                    text-sm
                    font-bold
                    text-slate-900
                    uppercase
                    tracking-wide
                    mb-4
                  ">
                    Booking History
                  </h3>

                  <div className="
                    border
                    border-slate-200
                    rounded-xl
                    overflow-hidden
                  ">

                    <div className="overflow-x-auto">

                      <table className="w-full min-w-[650px]">

                        <thead className="bg-slate-50">

                          <tr>

                            <th className="
                              px-4 py-3
                              text-left
                              text-xs
                              font-semibold
                              text-slate-500
                              uppercase
                            ">
                              Booking
                            </th>

                            <th className="
                              px-4 py-3
                              text-left
                              text-xs
                              font-semibold
                              text-slate-500
                              uppercase
                            ">
                              Trip
                            </th>

                            <th className="
                              px-4 py-3
                              text-left
                              text-xs
                              font-semibold
                              text-slate-500
                              uppercase
                            ">
                              Date
                            </th>

                            <th className="
                              px-4 py-3
                              text-left
                              text-xs
                              font-semibold
                              text-slate-500
                              uppercase
                            ">
                              Status
                            </th>

                          </tr>

                        </thead>

                        <tbody className="
                          divide-y
                          divide-slate-100
                        ">

                          {selectedCustomer.bookings.map(
                            (booking) => (

                              <tr key={booking.id}>

                                <td className="
                                  px-4 py-3
                                  text-sm
                                  font-semibold
                                  text-slate-800
                                ">
                                  #{booking.id}
                                </td>

                                <td className="
                                  px-4 py-3
                                ">

                                  <p className="
                                    text-sm
                                    text-slate-700
                                  ">
                                    {booking.tripType}
                                  </p>

                                  <p className="
                                    text-xs
                                    text-slate-500
                                    mt-1
                                  ">
                                    {booking.pickupLocation}
                                    {' → '}
                                    {booking.destination}
                                  </p>

                                </td>

                                <td className="
                                  px-4 py-3
                                  text-sm
                                  text-slate-600
                                ">
                                  {formatDate(
                                    booking.travelDate
                                  )}
                                </td>

                                <td className="
                                  px-4 py-3
                                ">

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

                              </tr>

                            )
                          )}

                        </tbody>

                      </table>

                    </div>

                  </div>

                </div>

              </div>

              {/* FOOTER */}

              <div className="
                px-6 py-5
                border-t border-slate-200
                bg-slate-50
                flex
                justify-end
              ">

                <button
                  onClick={closeCustomerModal}
                  className="
                    px-5 py-2.5
                    rounded-lg
                    border border-slate-300
                    bg-white
                    text-slate-700
                    font-semibold
                    text-sm
                    hover:bg-slate-100
                    transition
                  "
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

export default CustomersPage;