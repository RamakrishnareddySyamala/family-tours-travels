import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function TourPackagesPage() {
  const navigate = useNavigate();

  // ==========================================
  // API URL
  // ==========================================

  const API_URL = 'http://localhost:8082/api/tour-packages';

  // ==========================================
  // TOUR PACKAGES
  // ==========================================

  const [packages, setPackages] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');

  const [saving, setSaving] = useState(false);

  // ==========================================
  // MODAL
  // ==========================================

  const [showModal, setShowModal] = useState(false);

  const [editingPackage, setEditingPackage] = useState(null);

  // ==========================================
  // FORM
  // ==========================================

  const [formData, setFormData] = useState({
    name: '',
    destination: '',
    duration: '',
    price: '',
    status: 'ACTIVE',
    description: '',
  });

  // ==========================================
  // FETCH TOUR PACKAGES
  // ==========================================

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error('Failed to fetch tour packages');
      }

      const data = await response.json();

      setPackages(data);
    } catch (error) {
      console.error('Error fetching tour packages:', error);

      setError('Unable to load tour packages.');
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setFormData({
      name: '',
      destination: '',
      duration: '',
      price: '',
      status: 'ACTIVE',
      description: '',
    });
  };

  // ==========================================
  // OPEN ADD PACKAGE
  // ==========================================

  const handleAddPackage = () => {
    setEditingPackage(null);

    resetForm();

    setShowModal(true);
  };

  // ==========================================
  // OPEN EDIT PACKAGE
  // ==========================================

  const handleEditPackage = (tourPackage) => {
    setEditingPackage(tourPackage);

    setFormData({
      name: tourPackage.name || '',
      destination: tourPackage.destination || '',
      duration: tourPackage.duration || '',
      price:
        tourPackage.price !== null &&
        tourPackage.price !== undefined
          ? tourPackage.price
          : '',
      status: tourPackage.status || 'ACTIVE',
      description: tourPackage.description || '',
    });

    setShowModal(true);
  };

  // ==========================================
  // SAVE PACKAGE
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.destination.trim() ||
      !formData.duration.trim() ||
      !formData.price
    ) {
      alert('Please fill all required fields.');
      return;
    }

    try {
      setSaving(true);
      setError('');

      const packageData = {
        name: formData.name.trim(),
        destination: formData.destination.trim(),
        duration: formData.duration.trim(),
        price: Number(formData.price),
        status: formData.status,
        description: formData.description.trim(),
      };

      let response;

      // ==========================================
      // UPDATE PACKAGE
      // ==========================================

      if (editingPackage) {
        response = await fetch(
          `${API_URL}/${editingPackage.id}`,
          {
            method: 'PUT',

            headers: {
              'Content-Type': 'application/json',
            },

            body: JSON.stringify(packageData),
          }
        );
      }

      // ==========================================
      // CREATE PACKAGE
      // ==========================================

      else {
        response = await fetch(API_URL, {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify(packageData),
        });
      }

      if (!response.ok) {
        throw new Error(
          editingPackage
            ? 'Failed to update tour package'
            : 'Failed to create tour package'
        );
      }

      // Refresh from backend

      await fetchPackages();

      closeModal();
    } catch (error) {
      console.error('Error saving tour package:', error);

      setError(
        editingPackage
          ? 'Unable to update tour package.'
          : 'Unable to create tour package.'
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DELETE PACKAGE
  // ==========================================

  const handleDeletePackage = async (tourPackage) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${tourPackage.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError('');

      const response = await fetch(
        `${API_URL}/${tourPackage.id}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete tour package');
      }

      // Refresh from backend

      await fetchPackages();
    } catch (error) {
      console.error('Error deleting tour package:', error);

      setError('Unable to delete tour package.');
    }
  };

  // ==========================================
  // UPDATE PACKAGE STATUS
  // ==========================================

  const handleStatusChange = async (
    tourPackage,
    newStatus
  ) => {
    try {
      setError('');

      const response = await fetch(
        `${API_URL}/${tourPackage.id}/status?status=${encodeURIComponent(
          newStatus
        )}`,
        {
          method: 'PUT',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update package status');
      }

      await fetchPackages();
    } catch (error) {
      console.error(
        'Error updating package status:',
        error
      );

      setError('Unable to update package status.');
    }
  };

  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const closeModal = () => {
    setShowModal(false);

    setEditingPackage(null);

    resetForm();
  };

  // ==========================================
  // STATISTICS
  // ==========================================

  const totalPackages = packages.length;

  const activePackages = packages.filter(
    (tourPackage) =>
      tourPackage.status?.toUpperCase() === 'ACTIVE'
  ).length;

  const inactivePackages = packages.filter(
    (tourPackage) =>
      tourPackage.status?.toUpperCase() === 'INACTIVE'
  ).length;

  // ==========================================
  // FORMAT PRICE
  // ==========================================

  const formatPrice = (price) => {
    return Number(price).toLocaleString('en-IN');
  };

  // ==========================================
  // STATUS STYLE
  // ==========================================

  const getStatusClasses = (status) => {
    if (status?.toUpperCase() === 'ACTIVE') {
      return 'bg-green-100 text-green-700';
    }

    return 'bg-red-100 text-red-700';
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

          {/* Dashboard */}

          <button
            onClick={() => navigate('/admin')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition text-left"
          >
            <span>📊</span>
            <span>Dashboard</span>
          </button>

          {/* Bookings */}

          <button
            onClick={() =>
              navigate('/admin/bookings')
            }
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition text-left"
          >
            <span>📅</span>
            <span>Bookings</span>
          </button>

          {/* Tour Packages - ACTIVE */}

          <button
            onClick={() =>
              navigate('/admin/tour-packages')
            }
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-white/10 text-white text-left"
          >
            <span>🧳</span>
            <span>Tour Packages</span>
          </button>

          {/* Vehicles */}

          <button
            onClick={() =>
              navigate('/admin/vehicles')
            }
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition text-left"
          >
            <span>🚗</span>
            <span>Vehicles</span>
          </button>

          {/* Customers */}

          <button
            onClick={() =>
              navigate('/admin/customers')
            }
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition text-left"
          >
            <span>👥</span>
            <span>Customers</span>
          </button>

          {/* Reviews */}

          <button
            onClick={() =>
              navigate('/admin/reviews')
            }
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition text-left"
          >
            <span>⭐</span>
            <span>Reviews</span>
          </button>

        </nav>

        {/* Bottom Navigation */}

        <div className="px-4 py-5 border-t border-slate-800">

          <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition text-left"
          >
            <span>⚙️</span>
            <span>Settings</span>
          </button>

          <button
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

        {/* ==========================================
            TOP BAR
        ========================================== */}

        <header className="bg-white border-b border-slate-200 px-6 md:px-8 py-5">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div>

              <h2 className="text-2xl font-bold text-slate-900">
                Tour Packages
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Manage tour packages offered by Family Tours & Travels
              </p>

            </div>

            {/* ADD PACKAGE */}

            <button
              onClick={handleAddPackage}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition"
            >
              <span className="text-lg">+</span>
              Add Package
            </button>

          </div>

        </header>

        {/* ==========================================
            CONTENT
        ========================================== */}

        <div className="p-6 md:p-8">

          {/* BACK TO DASHBOARD */}

          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 mb-6 transition"
          >
            ← Back to Dashboard
          </button>

          {/* ERROR */}

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* ==========================================
              STATISTICS
          ========================================== */}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

            {/* Total */}

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-sm text-slate-500">
                    Total Packages
                  </p>

                  <h3 className="text-3xl font-bold text-slate-900 mt-2">
                    {totalPackages}
                  </h3>

                </div>

                <div className="w-11 h-11 rounded-lg bg-slate-100 flex items-center justify-center text-xl">
                  🧳
                </div>

              </div>

              <p className="text-xs text-slate-500 mt-4">
                All tour packages
              </p>

            </div>

            {/* Active */}

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-sm text-slate-500">
                    Active Packages
                  </p>

                  <h3 className="text-3xl font-bold text-slate-900 mt-2">
                    {activePackages}
                  </h3>

                </div>

                <div className="w-11 h-11 rounded-lg bg-green-100 flex items-center justify-center text-xl">
                  ✅
                </div>

              </div>

              <p className="text-xs text-slate-500 mt-4">
                Currently available
              </p>

            </div>

            {/* Inactive */}

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-sm text-slate-500">
                    Inactive Packages
                  </p>

                  <h3 className="text-3xl font-bold text-slate-900 mt-2">
                    {inactivePackages}
                  </h3>

                </div>

                <div className="w-11 h-11 rounded-lg bg-red-100 flex items-center justify-center text-xl">
                  ⛔
                </div>

              </div>

              <p className="text-xs text-slate-500 mt-4">
                Currently unavailable
              </p>

            </div>

          </div>

          {/* ==========================================
              TOUR PACKAGES TABLE
          ========================================== */}

          <div className="mt-8 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

            {/* Table Header */}

            <div className="px-6 py-5 border-b border-slate-200">

              <h3 className="text-lg font-bold text-slate-900">
                Tour Packages
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                View and manage your tour packages
              </p>

            </div>

            {/* Table */}

            <div className="overflow-x-auto">

              {loading ? (

                <div className="p-12 text-center">

                  <div className="text-3xl mb-4">
                    ⏳
                  </div>

                  <p className="text-sm text-slate-500">
                    Loading tour packages...
                  </p>

                </div>

              ) : packages.length === 0 ? (

                <div className="p-12 text-center">

                  <div className="text-5xl mb-4">
                    🧳
                  </div>

                  <h4 className="font-semibold text-slate-800">
                    No tour packages
                  </h4>

                  <p className="text-sm text-slate-500 mt-1">
                    Add your first tour package to get started.
                  </p>

                  <button
                    onClick={handleAddPackage}
                    className="mt-5 px-5 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800"
                  >
                    + Add Package
                  </button>

                </div>

              ) : (

                <table className="w-full min-w-[1000px]">

                  <thead className="bg-slate-50">

                    <tr>

                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">
                        Package
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">
                        Destination
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">
                        Duration
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">
                        Price
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">
                        Status
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">
                        Actions
                      </th>

                    </tr>

                  </thead>

                  <tbody className="divide-y divide-slate-100">

                    {packages.map((tourPackage) => (

                      <tr
                        key={tourPackage.id}
                        className="hover:bg-slate-50 transition"
                      >

                        {/* Package */}

                        <td className="px-6 py-5">

                          <p className="text-sm font-semibold text-slate-800">
                            {tourPackage.name}
                          </p>

                          <p className="text-xs text-slate-500 mt-1 max-w-xs truncate">
                            {tourPackage.description ||
                              'No description'}
                          </p>

                        </td>

                        {/* Destination */}

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-2">

                            <span>
                              📍
                            </span>

                            <span className="text-sm text-slate-700">
                              {tourPackage.destination}
                            </span>

                          </div>

                        </td>

                        {/* Duration */}

                        <td className="px-6 py-5">

                          <span className="text-sm text-slate-700">
                            {tourPackage.duration}
                          </span>

                        </td>

                        {/* Price */}

                        <td className="px-6 py-5">

                          <span className="text-sm font-bold text-slate-800">
                            ₹{formatPrice(tourPackage.price)}
                          </span>

                        </td>

                        {/* Status */}

                        <td className="px-6 py-5">

                          <select
                            value={
                              tourPackage.status ||
                              'ACTIVE'
                            }
                            onChange={(e) =>
                              handleStatusChange(
                                tourPackage,
                                e.target.value
                              )
                            }
                            className={`px-3 py-1.5 rounded-full text-xs font-bold border-0 outline-none cursor-pointer ${getStatusClasses(
                              tourPackage.status
                            )}`}
                          >

                            <option value="ACTIVE">
                              ACTIVE
                            </option>

                            <option value="INACTIVE">
                              INACTIVE
                            </option>

                          </select>

                        </td>

                        {/* Actions */}

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-2">

                            {/* Edit */}

                            <button
                              onClick={() =>
                                handleEditPackage(
                                  tourPackage
                                )
                              }
                              className="px-3 py-1.5 text-sm font-semibold text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-900 hover:text-white transition"
                            >
                              Edit
                            </button>

                            {/* Delete */}

                            <button
                              onClick={() =>
                                handleDeletePackage(
                                  tourPackage
                                )
                              }
                              className="px-3 py-1.5 text-sm font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition"
                            >
                              Delete
                            </button>

                          </div>

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
          ADD / EDIT PACKAGE MODAL
      ========================================== */}

      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

          {/* Overlay */}

          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* Modal */}

          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">

            {/* Modal Header */}

            <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">

              <div>

                <p className="text-xs font-semibold text-slate-500 uppercase">
                  Tour Package
                </p>

                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  {editingPackage
                    ? 'Edit Package'
                    : 'Add New Package'}
                </h2>

              </div>

              <button
                onClick={closeModal}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 text-xl"
              >
                ×
              </button>

            </div>

            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="p-6"
            >

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                {/* Package Name */}

                <div className="sm:col-span-2">

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Package Name *
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Example: Hyderabad Package"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-900"
                  />

                </div>

                {/* Destination */}

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Destination *
                  </label>

                  <input
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    placeholder="Example: Hyderabad"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-900"
                  />

                </div>

                {/* Duration */}

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Duration *
                  </label>

                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="Example: 4 Days / 3 Nights"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-900"
                  />

                </div>

                {/* Price */}

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Price *
                  </label>

                  <div className="flex">

                    <span className="px-4 py-3 bg-slate-100 border border-r-0 border-slate-300 rounded-l-lg text-slate-600">
                      ₹
                    </span>

                    <input
                      type="number"
                      name="price"
                      min="0"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="Example: 25000"
                      className="w-full px-4 py-3 border border-slate-300 rounded-r-lg outline-none focus:ring-2 focus:ring-slate-900"
                    />

                  </div>

                </div>

                {/* Status */}

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Status
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-900 bg-white"
                  >

                    <option value="ACTIVE">
                      ACTIVE
                    </option>

                    <option value="INACTIVE">
                      INACTIVE
                    </option>

                  </select>

                </div>

                {/* Description */}

                <div className="sm:col-span-2">

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Enter package description..."
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-900 resize-none"
                  />

                </div>

              </div>

              {/* Buttons */}

              <div className="flex flex-col sm:flex-row gap-3 mt-6">

                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-5 py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving
                    ? 'Saving...'
                    : editingPackage
                    ? 'Save Changes'
                    : 'Add Package'}
                </button>

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="px-5 py-3 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-100 transition disabled:opacity-50"
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default TourPackagesPage;