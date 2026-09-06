import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function VehiclesPage() {
  const navigate = useNavigate();

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

  // ==========================================
  // API URL
  // ==========================================

  const API_URL = 'http://localhost:8082/api/vehicles';

  // ==========================================
  // VEHICLES
  // ==========================================

  const [vehicles, setVehicles] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // ==========================================
  // MODAL
  // ==========================================

  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  // ==========================================
  // FORM
  // ==========================================

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    seats: '',
    registrationNumber: '',
    pricePerDay: '',
    status: 'AVAILABLE',
  });

  // ==========================================
  // FETCH VEHICLES
  // ==========================================

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(API_URL, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch vehicles');
      }

      const data = await response.json();

      setVehicles(data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setError('Unable to load vehicles.');
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD VEHICLES WHEN PAGE OPENS
  // ==========================================

  useEffect(() => {
    fetchVehicles();
  }, []);

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
  // ADD VEHICLE
  // ==========================================

  const handleAddVehicle = () => {
    setEditingVehicle(null);

    setFormData({
      name: '',
      type: '',
      seats: '',
      registrationNumber: '',
      pricePerDay: '',
      status: 'AVAILABLE',
    });

    setShowModal(true);
  };

  // ==========================================
  // EDIT VEHICLE
  // ==========================================

  const handleEditVehicle = (vehicle) => {
    setEditingVehicle(vehicle);

    setFormData({
      name: vehicle.name || '',
      type: vehicle.type || '',
      seats: vehicle.seats || '',
      registrationNumber: vehicle.registrationNumber || '',
      pricePerDay: vehicle.pricePerDay || '',
      status: vehicle.status || 'AVAILABLE',
    });

    setShowModal(true);
  };

  // ==========================================
  // SAVE VEHICLE
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ------------------------------------------
    // FRONTEND VALIDATION
    // ------------------------------------------

    if (
      !formData.name.trim() ||
      !formData.type.trim() ||
      !formData.seats ||
      !formData.registrationNumber.trim() ||
      formData.pricePerDay === ''
    ) {
      alert('Please fill all required fields.');
      return;
    }

    try {
      setSaving(true);
      setError('');

      // ----------------------------------------
      // REQUEST BODY
      // ----------------------------------------

      const vehicleData = {
        name: formData.name.trim(),
        type: formData.type,
        seats: Number(formData.seats),
        registrationNumber:
          formData.registrationNumber.trim().toUpperCase(),
        pricePerDay: Number(formData.pricePerDay),
        status: formData.status,
      };

      // ========================================
      // UPDATE VEHICLE
      // ========================================

      if (editingVehicle) {
        const response = await fetch(
          `${API_URL}/${editingVehicle.id}`,
          {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(vehicleData),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to update vehicle');
        }

        const updatedVehicle = await response.json();

        setVehicles((previousVehicles) =>
          previousVehicles.map((vehicle) =>
            vehicle.id === editingVehicle.id
              ? updatedVehicle
              : vehicle
          )
        );

        alert('Vehicle updated successfully.');
      }

      // ========================================
      // CREATE VEHICLE
      // ========================================

      else {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(vehicleData),
        });

        if (!response.ok) {
          throw new Error('Failed to create vehicle');
        }

        const newVehicle = await response.json();

        setVehicles((previousVehicles) => [
          ...previousVehicles,
          newVehicle,
        ]);

        alert('Vehicle added successfully.');
      }

      closeModal();

    } catch (error) {
      console.error('Error saving vehicle:', error);

      setError(
        editingVehicle
          ? 'Unable to update vehicle.'
          : 'Unable to add vehicle.'
      );

      alert(
        editingVehicle
          ? 'Failed to update vehicle.'
          : 'Failed to add vehicle.'
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DELETE VEHICLE
  // ==========================================

  const handleDeleteVehicle = async (vehicle) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${vehicle.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError('');

      const response = await fetch(
        `${API_URL}/${vehicle.id}`,
        {
          method: 'DELETE',
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete vehicle');
      }

      setVehicles((previousVehicles) =>
        previousVehicles.filter(
          (item) => item.id !== vehicle.id
        )
      );

      alert('Vehicle deleted successfully.');

    } catch (error) {
      console.error('Error deleting vehicle:', error);

      setError('Unable to delete vehicle.');

      alert('Failed to delete vehicle.');
    }
  };

  // ==========================================
  // UPDATE VEHICLE STATUS
  // ==========================================

  const handleStatusChange = async (vehicle) => {
    const newStatus =
      vehicle.status?.toUpperCase() === 'AVAILABLE'
        ? 'UNAVAILABLE'
        : 'AVAILABLE';

    try {
      setError('');

      const response = await fetch(
        `${API_URL}/${vehicle.id}/status?status=${newStatus}`,
        {
          method: 'PUT',
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update vehicle status');
      }

      const updatedVehicle = await response.json();

      setVehicles((previousVehicles) =>
        previousVehicles.map((item) =>
          item.id === vehicle.id
            ? updatedVehicle
            : item
        )
      );

    } catch (error) {
      console.error(
        'Error updating vehicle status:',
        error
      );

      setError('Unable to update vehicle status.');

      alert('Failed to update vehicle status.');
    }
  };

  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const closeModal = () => {
    setShowModal(false);
    setEditingVehicle(null);

    setFormData({
      name: '',
      type: '',
      seats: '',
      registrationNumber: '',
      pricePerDay: '',
      status: 'AVAILABLE',
    });
  };

  // ==========================================
  // STATISTICS
  // ==========================================

  const totalVehicles = vehicles.length;

  const availableVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.status?.toUpperCase() === 'AVAILABLE'
  ).length;

  const unavailableVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.status?.toUpperCase() === 'UNAVAILABLE'
  ).length;

  // ==========================================
  // FORMAT PRICE
  // ==========================================

  const formatPrice = (price) => {
    return Number(price).toLocaleString('en-IN');
  };

  // ==========================================
  // STATUS CLASSES
  // ==========================================

  const getStatusClasses = (status) => {
    if (status?.toUpperCase() === 'AVAILABLE') {
      return 'bg-green-100 text-green-700';
    }

    return 'bg-red-100 text-red-700';
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-100 flex">

      {/* SIDEBAR */}

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
            onClick={() => navigate('/admin/bookings')}
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
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-white/10 text-white text-left"
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
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition text-left"
          >
            <span>⭐</span>
            <span>Reviews</span>
          </button>

        </nav>

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

      {/* MAIN CONTENT */}

      <main className="flex-1 min-w-0">

        <header className="bg-white border-b border-slate-200 px-6 md:px-8 py-5">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div>

              <h2 className="text-2xl font-bold text-slate-900">
                Vehicles
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Manage vehicles offered by Family Tours & Travels
              </p>

            </div>

            <button
              onClick={handleAddVehicle}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition"
            >
              <span className="text-lg">+</span>
              Add Vehicle
            </button>

          </div>

        </header>

        <div className="p-6 md:p-8">

          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 mb-6 transition"
          >
            ← Back to Dashboard
          </button>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* STATISTICS */}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-sm text-slate-500">
                    Total Vehicles
                  </p>

                  <h3 className="text-3xl font-bold text-slate-900 mt-2">
                    {totalVehicles}
                  </h3>

                </div>

                <div className="w-11 h-11 rounded-lg bg-slate-100 flex items-center justify-center text-xl">
                  🚗
                </div>

              </div>

              <p className="text-xs text-slate-500 mt-4">
                All registered vehicles
              </p>

            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-sm text-slate-500">
                    Available Vehicles
                  </p>

                  <h3 className="text-3xl font-bold text-slate-900 mt-2">
                    {availableVehicles}
                  </h3>

                </div>

                <div className="w-11 h-11 rounded-lg bg-green-100 flex items-center justify-center text-xl">
                  ✅
                </div>

              </div>

              <p className="text-xs text-slate-500 mt-4">
                Ready for bookings
              </p>

            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-sm text-slate-500">
                    Unavailable Vehicles
                  </p>

                  <h3 className="text-3xl font-bold text-slate-900 mt-2">
                    {unavailableVehicles}
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

          {/* VEHICLES TABLE */}

          <div className="mt-8 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

            <div className="px-6 py-5 border-b border-slate-200">

              <h3 className="text-lg font-bold text-slate-900">
                Vehicles
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                View and manage your vehicles
              </p>

            </div>

            <div className="overflow-x-auto">

              {loading ? (

                <div className="p-12 text-center">

                  <div className="text-4xl mb-4">
                    ⏳
                  </div>

                  <p className="text-sm text-slate-500">
                    Loading vehicles...
                  </p>

                </div>

              ) : vehicles.length === 0 ? (

                <div className="p-12 text-center">

                  <div className="text-5xl mb-4">
                    🚗
                  </div>

                  <h4 className="font-semibold text-slate-800">
                    No vehicles
                  </h4>

                  <p className="text-sm text-slate-500 mt-1">
                    Add your first vehicle to get started.
                  </p>

                  <button
                    onClick={handleAddVehicle}
                    className="mt-5 px-5 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800"
                  >
                    + Add Vehicle
                  </button>

                </div>

              ) : (

                <table className="w-full min-w-[1100px]">

                  <thead className="bg-slate-50">

                    <tr>

                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">
                        Vehicle
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">
                        Type
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">
                        Seats
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">
                        Registration
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">
                        Price / Day
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

                    {vehicles.map((vehicle) => (

                      <tr
                        key={vehicle.id}
                        className="hover:bg-slate-50 transition"
                      >

                        <td className="px-6 py-5">

                          <p className="text-sm font-semibold text-slate-800">
                            {vehicle.name}
                          </p>

                          <p className="text-xs text-slate-500 mt-1">
                            Vehicle #{vehicle.id}
                          </p>

                        </td>

                        <td className="px-6 py-5">

                          <span className="text-sm text-slate-700">
                            {vehicle.type}
                          </span>

                        </td>

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-2">

                            <span>👥</span>

                            <span className="text-sm text-slate-700">
                              {vehicle.seats}
                            </span>

                          </div>

                        </td>

                        <td className="px-6 py-5">

                          <span className="text-sm font-medium text-slate-700">
                            {vehicle.registrationNumber}
                          </span>

                        </td>

                        <td className="px-6 py-5">

                          <span className="text-sm font-bold text-slate-800">
                            ₹{formatPrice(vehicle.pricePerDay)}
                          </span>

                        </td>

                        <td className="px-6 py-5">

                          <button
                            onClick={() =>
                              handleStatusChange(vehicle)
                            }
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-bold cursor-pointer ${getStatusClasses(
                              vehicle.status
                            )}`}
                            title="Click to change status"
                          >
                            {vehicle.status}
                          </button>

                        </td>

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-2">

                            <button
                              onClick={() =>
                                handleEditVehicle(vehicle)
                              }
                              className="px-3 py-1.5 text-sm font-semibold text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-900 hover:text-white transition"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() =>
                                handleDeleteVehicle(vehicle)
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

      {/* ADD / EDIT VEHICLE MODAL */}

      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
          />

          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">

            <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">

              <div>

                <p className="text-xs font-semibold text-slate-500 uppercase">
                  Vehicle Management
                </p>

                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  {editingVehicle
                    ? 'Edit Vehicle'
                    : 'Add New Vehicle'}
                </h2>

              </div>

              <button
                onClick={closeModal}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 text-xl"
              >
                ×
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6"
            >

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Vehicle Name *
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Example: Suzuki Ertiga"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-900"
                  />

                </div>

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Vehicle Type *
                  </label>

                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-900 bg-white"
                  >

                    <option value="">
                      Select Type
                    </option>

                    <option value="Sedan">
                      Sedan
                    </option>

                    <option value="SUV">
                      SUV
                    </option>

                    <option value="MUV">
                      MUV
                    </option>

                    <option value="Hatchback">
                      Hatchback
                    </option>

                    <option value="Tempo Traveller">
                      Tempo Traveller
                    </option>

                    <option value="Other">
                      Other
                    </option>

                  </select>

                </div>

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Seating Capacity *
                  </label>

                  <input
                    type="number"
                    name="seats"
                    min="1"
                    value={formData.seats}
                    onChange={handleChange}
                    placeholder="Example: 7"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-900"
                  />

                </div>

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Registration Number *
                  </label>

                  <input
                    type="text"
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    placeholder="Example: AP00AB1234"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-900 uppercase"
                  />

                </div>

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Price Per Day *
                  </label>

                  <div className="flex">

                    <span className="px-4 py-3 bg-slate-100 border border-r-0 border-slate-300 rounded-l-lg text-slate-600">
                      ₹
                    </span>

                    <input
                      type="number"
                      name="pricePerDay"
                      min="0"
                      value={formData.pricePerDay}
                      onChange={handleChange}
                      placeholder="Example: 2500"
                      className="w-full px-4 py-3 border border-slate-300 rounded-r-lg outline-none focus:ring-2 focus:ring-slate-900"
                    />

                  </div>

                </div>

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

                    <option value="AVAILABLE">
                      AVAILABLE
                    </option>

                    <option value="UNAVAILABLE">
                      UNAVAILABLE
                    </option>

                  </select>

                </div>

              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-6">

                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-5 py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving
                    ? 'Saving...'
                    : editingVehicle
                    ? 'Save Changes'
                    : 'Add Vehicle'}
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

export default VehiclesPage;