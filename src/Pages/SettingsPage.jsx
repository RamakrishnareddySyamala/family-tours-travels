
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SettingsPage() {
  const navigate = useNavigate();

  // =====================================================
  // API
  // =====================================================

  const API_URL = 'http://localhost:8082/api/settings';

  // =====================================================
  // AUTH HEADERS
  // =====================================================

  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');

    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  // =====================================================
  // STATE
  // =====================================================

  const [settings, setSettings] = useState({
    companyName: '',
    phoneNumber: '',
    email: '',
    whatsappNumber: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    openingTime: '',
    closingTime: '',
    onlineBooking: true,
    whatsappBooking: true,
    callBooking: true,
    emailNotifications: true,
    bookingNotifications: true,
    reviewNotifications: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // =====================================================
  // FETCH SETTINGS
  // =====================================================

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const response = await fetch(API_URL, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to load settings. Status: ${response.status}`
        );
      }

      const data = await response.json();

      setSettings({
        companyName: data.companyName || '',
        phoneNumber: data.phoneNumber || '',
        email: data.email || '',
        whatsappNumber: data.whatsappNumber || '',
        address: data.address || '',
        city: data.city || '',
        state: data.state || '',
        pincode: data.pincode || '',
        openingTime: data.openingTime || '',
        closingTime: data.closingTime || '',

        onlineBooking:
          data.onlineBooking !== undefined
            ? data.onlineBooking
            : true,

        whatsappBooking:
          data.whatsappBooking !== undefined
            ? data.whatsappBooking
            : true,

        callBooking:
          data.callBooking !== undefined
            ? data.callBooking
            : true,

        emailNotifications:
          data.emailNotifications !== undefined
            ? data.emailNotifications
            : true,

        bookingNotifications:
          data.bookingNotifications !== undefined
            ? data.bookingNotifications
            : true,

        reviewNotifications:
          data.reviewNotifications !== undefined
            ? data.reviewNotifications
            : true,
      });

    } catch (error) {
      console.error('Error loading settings:', error);

      setError(
        'Unable to load settings. Please make sure the backend is running.'
      );

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD SETTINGS WHEN PAGE OPENS
  // =====================================================

  useEffect(() => {
    fetchSettings();
  }, []);

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSettings((previousSettings) => ({
      ...previousSettings,
      [name]: value,
    }));

    setSuccess('');
    setError('');
  };

  // =====================================================
  // HANDLE TOGGLE
  // =====================================================

  const handleToggle = (name) => {
    setSettings((previousSettings) => ({
      ...previousSettings,
      [name]: !previousSettings[name],
    }));

    setSuccess('');
    setError('');
  };

  // =====================================================
  // SAVE SETTINGS
  // =====================================================

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const response = await fetch(API_URL, {
        method: 'PUT',

        headers: getAuthHeaders(),

        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to save settings. Status: ${response.status}`
        );
      }

      const updatedSettings = await response.json();

      setSettings({
        companyName: updatedSettings.companyName || '',
        phoneNumber: updatedSettings.phoneNumber || '',
        email: updatedSettings.email || '',
        whatsappNumber:
          updatedSettings.whatsappNumber || '',
        address: updatedSettings.address || '',
        city: updatedSettings.city || '',
        state: updatedSettings.state || '',
        pincode: updatedSettings.pincode || '',
        openingTime:
          updatedSettings.openingTime || '',
        closingTime:
          updatedSettings.closingTime || '',

        onlineBooking:
          updatedSettings.onlineBooking ?? true,

        whatsappBooking:
          updatedSettings.whatsappBooking ?? true,

        callBooking:
          updatedSettings.callBooking ?? true,

        emailNotifications:
          updatedSettings.emailNotifications ?? true,

        bookingNotifications:
          updatedSettings.bookingNotifications ?? true,

        reviewNotifications:
          updatedSettings.reviewNotifications ?? true,
      });

      setSuccess('Settings saved successfully.');

    } catch (error) {
      console.error('Error saving settings:', error);

      setError(
        'Unable to save settings. Please try again.'
      );

    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // RESET / RELOAD SETTINGS
  // =====================================================

  const handleReset = async () => {
    const confirmed = window.confirm(
      'Discard your current changes and reload the saved settings?'
    );

    if (!confirmed) {
      return;
    }

    await fetchSettings();
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-100 flex">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

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
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition text-left"
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
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-white/10 text-white transition text-left"
          >
            <span>⚙️</span>
            <span>Settings</span>
          </button>

          <button
            onClick={() => navigate('/admin')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition text-left mt-2"
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>

        </div>

      </aside>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="flex-1 min-w-0">

        <header className="bg-white border-b border-slate-200 px-6 md:px-8 py-5">

          <h2 className="text-2xl font-bold text-slate-900">
            Settings
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Manage Family Tours & Travels settings
          </p>

        </header>

        <div className="p-6 md:p-8 max-w-6xl">

          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 mb-6 transition"
          >
            ← Back to Dashboard
          </button>

          {/* LOADING */}

          {loading && (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">

              <div className="text-4xl mb-4">
                ⏳
              </div>

              <p className="text-sm text-slate-500">
                Loading settings...
              </p>

            </div>
          )}

          {!loading && (
            <form onSubmit={handleSave}>

              {/* =================================================
                  ERROR
              ================================================= */}

              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-5">

                  <div className="flex items-center justify-between gap-4">

                    <div>

                      <p className="font-semibold text-red-700">
                        Something went wrong
                      </p>

                      <p className="text-sm text-red-600 mt-1">
                        {error}
                      </p>

                    </div>

                    <button
                      type="button"
                      onClick={fetchSettings}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700"
                    >
                      Retry
                    </button>

                  </div>

                </div>
              )}

              {/* =================================================
                  SUCCESS
              ================================================= */}

              {success && (
                <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-5">

                  <p className="font-semibold text-green-700">
                    ✓ {success}
                  </p>

                  <p className="text-sm text-green-600 mt-1">
                    Your settings have been saved to the database.
                  </p>

                </div>
              )}

              {/* =================================================
                  COMPANY INFORMATION
              ================================================= */}

              <div className="bg-white rounded-xl border border-slate-200 shadow-sm">

                <div className="px-6 py-5 border-b border-slate-200">

                  <h3 className="text-lg font-bold text-slate-900">
                    Company Information
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    Basic business contact information
                  </p>

                </div>

                <div className="p-6">

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div className="md:col-span-2">

                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Company Name
                      </label>

                      <input
                        type="text"
                        name="companyName"
                        value={settings.companyName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-900"
                        placeholder="Family Tours & Travels"
                      />

                    </div>

                    <div>

                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Phone Number
                      </label>

                      <input
                        type="tel"
                        name="phoneNumber"
                        value={settings.phoneNumber}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-900"
                        placeholder="Enter phone number"
                      />

                    </div>

                    <div>

                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Email Address
                      </label>

                      <input
                        type="email"
                        name="email"
                        value={settings.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-900"
                        placeholder="Enter email address"
                      />

                    </div>

                    <div>

                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        WhatsApp Number
                      </label>

                      <input
                        type="tel"
                        name="whatsappNumber"
                        value={settings.whatsappNumber}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-900"
                        placeholder="Enter WhatsApp number"
                      />

                    </div>

                  </div>

                </div>

              </div>

              {/* =================================================
                  BUSINESS ADDRESS
              ================================================= */}

              <div className="mt-6 bg-white rounded-xl border border-slate-200 shadow-sm">

                <div className="px-6 py-5 border-b border-slate-200">

                  <h3 className="text-lg font-bold text-slate-900">
                    Business Address
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    Address displayed on your website
                  </p>

                </div>

                <div className="p-6">

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div className="md:col-span-2">

                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Address
                      </label>

                      <textarea
                        name="address"
                        value={settings.address}
                        onChange={handleChange}
                        rows="3"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-900 resize-none"
                        placeholder="Enter business address"
                      />

                    </div>

                    <div>

                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        City
                      </label>

                      <input
                        type="text"
                        name="city"
                        value={settings.city}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-900"
                        placeholder="Enter city"
                      />

                    </div>

                    <div>

                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        State
                      </label>

                      <input
                        type="text"
                        name="state"
                        value={settings.state}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-900"
                        placeholder="Enter state"
                      />

                    </div>

                    <div>

                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Pincode
                      </label>

                      <input
                        type="text"
                        name="pincode"
                        value={settings.pincode}
                        onChange={handleChange}
                        maxLength="6"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-900"
                        placeholder="Enter pincode"
                      />

                    </div>

                  </div>

                </div>

              </div>

              {/* =================================================
                  BUSINESS HOURS
              ================================================= */}

              <div className="mt-6 bg-white rounded-xl border border-slate-200 shadow-sm">

                <div className="px-6 py-5 border-b border-slate-200">

                  <h3 className="text-lg font-bold text-slate-900">
                    Business Hours
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    Set your daily operating hours
                  </p>

                </div>

                <div className="p-6">

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div>

                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Opening Time
                      </label>

                      <input
                        type="time"
                        name="openingTime"
                        value={settings.openingTime}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-900"
                      />

                    </div>

                    <div>

                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Closing Time
                      </label>

                      <input
                        type="time"
                        name="closingTime"
                        value={settings.closingTime}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-900"
                      />

                    </div>

                  </div>

                </div>

              </div>

              {/* =================================================
                  BOOKING SETTINGS
              ================================================= */}

              <div className="mt-6 bg-white rounded-xl border border-slate-200 shadow-sm">

                <div className="px-6 py-5 border-b border-slate-200">

                  <h3 className="text-lg font-bold text-slate-900">
                    Booking Settings
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    Control how customers can contact and book
                  </p>

                </div>

                <div className="p-6 space-y-4">

                  <ToggleRow
                    title="Online Booking"
                    description="Allow customers to submit booking requests through the website."
                    enabled={settings.onlineBooking}
                    onClick={() =>
                      handleToggle('onlineBooking')
                    }
                  />

                  <ToggleRow
                    title="WhatsApp Booking"
                    description="Allow customers to contact the business through WhatsApp."
                    enabled={settings.whatsappBooking}
                    onClick={() =>
                      handleToggle('whatsappBooking')
                    }
                  />

                  <ToggleRow
                    title="Call Booking"
                    description="Allow customers to contact the business by phone."
                    enabled={settings.callBooking}
                    onClick={() =>
                      handleToggle('callBooking')
                    }
                  />

                </div>

              </div>

              {/* =================================================
                  NOTIFICATION SETTINGS
              ================================================= */}

              <div className="mt-6 bg-white rounded-xl border border-slate-200 shadow-sm">

                <div className="px-6 py-5 border-b border-slate-200">

                  <h3 className="text-lg font-bold text-slate-900">
                    Notification Settings
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    Choose which notifications should be enabled
                  </p>

                </div>

                <div className="p-6 space-y-4">

                  <ToggleRow
                    title="Email Notifications"
                    description="Receive important business notifications by email."
                    enabled={settings.emailNotifications}
                    onClick={() =>
                      handleToggle('emailNotifications')
                    }
                  />

                  <ToggleRow
                    title="Booking Notifications"
                    description="Receive notifications when a new booking is submitted."
                    enabled={settings.bookingNotifications}
                    onClick={() =>
                      handleToggle('bookingNotifications')
                    }
                  />

                  <ToggleRow
                    title="Review Notifications"
                    description="Receive notifications when customers submit reviews."
                    enabled={settings.reviewNotifications}
                    onClick={() =>
                      handleToggle('reviewNotifications')
                    }
                  />

                </div>

              </div>

              {/* =================================================
                  ACTION BUTTONS
              ================================================= */}

              <div className="mt-6 bg-white rounded-xl border border-slate-200 shadow-sm p-6">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                  <div>

                    <p className="font-semibold text-slate-800">
                      Save your changes
                    </p>

                    <p className="text-sm text-slate-500 mt-1">
                      Changes will be stored in the database.
                    </p>

                  </div>

                  <div className="flex gap-3">

                    <button
                      type="button"
                      onClick={handleReset}
                      disabled={saving}
                      className="px-5 py-3 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 transition disabled:opacity-50"
                    >
                      ↻ Reset
                    </button>

                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition disabled:opacity-50"
                    >
                      {saving
                        ? 'Saving...'
                        : 'Save Settings'}
                    </button>

                  </div>

                </div>

              </div>

              {/* =================================================
                  ADMIN PANEL INFORMATION
              ================================================= */}

              <div className="mt-6 bg-white rounded-xl border border-slate-200 shadow-sm">

                <div className="px-6 py-5 border-b border-slate-200">

                  <h3 className="text-lg font-bold text-slate-900">
                    Admin Panel
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    Application information
                  </p>

                </div>

                <div className="p-6">

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                    <InfoBox
                      label="Application"
                      value="Family Tours & Travels"
                    />

                    <InfoBox
                      label="Panel"
                      value="Admin Panel"
                    />

                    <InfoBox
                      label="Frontend"
                      value="React + Vite"
                    />

                    <InfoBox
                      label="Backend"
                      value="Spring Boot"
                    />

                    <InfoBox
                      label="Database"
                      value="MySQL"
                    />

                    <InfoBox
                      label="Settings API"
                      value="/api/settings"
                    />

                  </div>

                </div>

              </div>

            </form>
          )}

        </div>

      </main>

    </div>
  );
}

// =====================================================
// TOGGLE COMPONENT
// =====================================================

function ToggleRow({
  title,
  description,
  enabled,
  onClick,
}) {
  return (
    <div className="flex items-center justify-between gap-5 p-4 bg-slate-50 rounded-xl border border-slate-200">

      <div>

        <p className="text-sm font-semibold text-slate-800">
          {title}
        </p>

        <p className="text-xs text-slate-500 mt-1">
          {description}
        </p>

      </div>

      <button
        type="button"
        onClick={onClick}
        className={`relative flex-shrink-0 w-12 h-7 rounded-full transition ${
          enabled
            ? 'bg-green-600'
            : 'bg-slate-300'
        }`}
        aria-pressed={enabled}
      >

        <span
          className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition ${
            enabled
              ? 'left-6'
              : 'left-1'
          }`}
        />

      </button>

    </div>
  );
}

// =====================================================
// INFO BOX
// =====================================================

function InfoBox({ label, value }) {
  return (
    <div className="bg-slate-50 rounded-lg p-4">

      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="text-sm font-semibold text-slate-800 mt-1">
        {value}
      </p>

    </div>
  );
}

export default SettingsPage;
