import React from 'react';
import { useNavigate } from 'react-router-dom';

function LogoutPage() {

  const navigate = useNavigate();

  const handleLogout = () => {

    // Remove JWT token
    localStorage.removeItem('adminToken');

    // Go back to customer website
    navigate('/');
  };

  const handleCancel = () => {
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">

        <div className="text-5xl mb-4">
          🚪
        </div>

        <h1 className="text-2xl font-bold text-slate-800">
          Are you sure you want to logout?
        </h1>

        <p className="text-slate-500 mt-3 mb-8">
          You will be redirected to the Family Tours & Travels home page.
        </p>

        <div className="flex gap-4 justify-center">

          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition"
          >
            Yes, Logout
          </button>

          <button
            onClick={handleCancel}
            className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold px-6 py-3 rounded-lg transition"
          >
            Cancel
          </button>

        </div>

      </div>

    </div>
  );
}

export default LogoutPage;