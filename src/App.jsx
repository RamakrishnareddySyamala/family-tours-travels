import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Customer website components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Vehicle from './components/Vehicle';
import TourPackages from './components/TourPackages';
import WhyChooseUs from './components/WhyChooseUs';
import Reviews from './components/Reviews';
import BookingForm from './components/BookingForm';
import Contact from './components/Contact';
import WhatsAppButton from './components/WhatsAppButton';
import Footer from './components/Footer';

// Admin pages
import AdminPage from './Pages/AdminPage';
import BookingsPage from './Pages/BookingsPage';

import CustomersPage from './Pages/CustomersPage';
import VehiclesPage from './Pages/VehiclesPage';


import TourPackagesPage from "./Pages/ToursPackagePage";

import ReviewsPage from './Pages/ReviewsPage';


import SettingsPage from './Pages/SettingsPage';


import LogoutPage from './Pages/LogoutPage';

import AdminLoginPage from './Pages/AdminLoginPage';

import ProtectedRoute from './Pages/ProtectedRoute';

// ============================================================
// CUSTOMER HOME PAGE
// ============================================================

function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">

      <Navbar />

      <main className="flex-grow">
        <Hero />
        <Services />
        <Vehicle />
        <TourPackages />
        <WhyChooseUs />
        <Reviews />
        <BookingForm />
        <Contact />
      </main>

      <Footer />

      <WhatsAppButton />

    </div>
  );
}


// ============================================================
// APP
// ============================================================

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Customer Website */}
        <Route
          path="/"
          element={<HomePage />}
        />

        {/* Admin Dashboard */}
        {/* Admin Login */}
{/* Admin Login */}
<Route
  path="/admin/login"
  element={<AdminLoginPage />}
/>

{/* Protected Admin Dashboard */}
<Route
  path="/admin"
  element={
    <ProtectedRoute>
      <AdminPage />
    </ProtectedRoute>
  }
/>

{/* Protected Admin Bookings */}
<Route
  path="/admin/bookings"
  element={
    <ProtectedRoute>
      <BookingsPage />
    </ProtectedRoute>
  }
/>

{/* Protected Admin Customers */}
<Route
  path="/admin/customers"
  element={
    <ProtectedRoute>
      <CustomersPage />
    </ProtectedRoute>
  }
/>

{/* Protected Tour Packages */}
<Route
  path="/admin/tour-packages"
  element={
    <ProtectedRoute>
      <TourPackagesPage />
    </ProtectedRoute>
  }
/>

{/* Protected Vehicles */}
<Route
  path="/admin/vehicles"
  element={
    <ProtectedRoute>
      <VehiclesPage />
    </ProtectedRoute>
  }
/>

{/* Protected Reviews */}
<Route
  path="/admin/reviews"
  element={
    <ProtectedRoute>
      <ReviewsPage />
    </ProtectedRoute>
  }
/>

{/* Protected Settings */}
<Route
  path="/admin/settings"
  element={
    <ProtectedRoute>
      <SettingsPage />
    </ProtectedRoute>
  }
/>

{/* Logout */}
<Route
  path="/admin/logout"
  element={
    <ProtectedRoute>
      <LogoutPage />
    </ProtectedRoute>
  }
/>
</Routes>

  

    </BrowserRouter>
  );
}

export default App;