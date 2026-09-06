import React, { useState } from 'react';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Calendar,
  MapPin,
  User,
  Phone,
  Users,
  Car,
} from 'lucide-react';

import { BUSINESS_CONFIG } from '../constants/config';
import useSettings from '../hooks/useSettings';

const BookingForm = () => {
  const { settings, loading: settingsLoading } = useSettings();

  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    pickupLocation: '',
    destination: '',
    travelDate: '',
    passengers: '1',
    serviceType: 'Car with Driver',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // =====================================================
  // SETTINGS
  // =====================================================

  const companyName =
    settings?.companyName ||
    BUSINESS_CONFIG.name ||
    'Family Tours & Travels';

  const whatsappNumber =
    settings?.whatsappNumber ||
    BUSINESS_CONFIG.whatsapp ||
    '';

  const phoneNumber =
    settings?.phoneNumber ||
    BUSINESS_CONFIG.phone ||
    '';

  const onlineBooking =
    settings?.onlineBooking ?? true;

  const whatsappBooking =
    settings?.whatsappBooking ?? true;

  const callBooking =
    settings?.callBooking ?? true;

  // =====================================================
  // SERVICE OPTIONS
  // =====================================================

  const serviceOptions = [
    'Car with Driver',
    'Local Trip',
    'Outstation Trip',
    'Airport Pickup & Drop',
    'Tour Package',
  ];

  // =====================================================
  // WHATSAPP LINK
  // =====================================================

  const getWhatsAppUrl = (message = '') => {
    if (!whatsappNumber) {
      return '#';
    }

    const cleanedNumber = String(
      whatsappNumber
    ).replace(/\D/g, '');

    const finalNumber = cleanedNumber.startsWith('91')
      ? cleanedNumber
      : `91${cleanedNumber}`;

    const encodedMessage =
      encodeURIComponent(message);

    return `https://wa.me/${finalNumber}${
      message ? `?text=${encodedMessage}` : ''
    }`;
  };

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // =====================================================
  // VALIDATION
  // =====================================================

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName =
        'Full Name is required';
    }

    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber =
        'Mobile Number is required';
    } else if (
      !/^[6-9]\d{9}$/.test(
        formData.mobileNumber.trim()
      )
    ) {
      newErrors.mobileNumber =
        'Enter a valid 10-digit mobile number';
    }

    if (!formData.pickupLocation.trim()) {
      newErrors.pickupLocation =
        'Pickup Location is required';
    }

    if (!formData.destination.trim()) {
      newErrors.destination =
        'Destination is required';
    }

    if (!formData.travelDate) {
      newErrors.travelDate =
        'Travel Date is required';
    } else {
      const selectedDate = new Date(
        formData.travelDate
      );

      const today = new Date();

      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.travelDate =
          'Travel date cannot be in the past';
      }
    }

    const passengerCount =
      Number(formData.passengers);

    if (
      passengerCount < 1 ||
      passengerCount > 7
    ) {
      newErrors.passengers =
        'Passengers must be between 1 and 7';
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  // =====================================================
  // SUBMIT BOOKING
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!onlineBooking) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const bookingData = {
      customerName:
        formData.fullName.trim(),

      mobileNumber:
        formData.mobileNumber.trim(),

      email: '',

      tripType:
        formData.serviceType,

      pickupLocation:
        formData.pickupLocation.trim(),

      destination:
        formData.destination.trim(),

      travelDate:
        formData.travelDate,

      numberOfPassengers:
        Number(formData.passengers),

      message:
        formData.message.trim(),
    };

    try {
      const response = await fetch(
        'http://localhost:8082/api/bookings',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify(
            bookingData
          ),
        }
      );

      if (!response.ok) {
        let errorMessage =
          'Booking failed. Please try again.';

        try {
          const errorData =
            await response.json();

          console.error(
            'Booking failed:',
            errorData
          );

          if (errorData.message) {
            errorMessage =
              errorData.message;
          }
        } catch {
          console.error(
            'Unable to read backend error response.'
          );
        }

        alert(errorMessage);

        return;
      }

      const savedBooking =
        await response.json();

      console.log(
        'Booking created successfully:',
        savedBooking
      );

      setSubmitted(true);
    } catch (error) {
      console.error(
        'Backend connection error:',
        error
      );

      alert(
        'Unable to connect to the booking server. Please make sure the Spring Boot backend is running.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // =====================================================
  // WHATSAPP MESSAGE
  // =====================================================

  const constructWhatsAppMessage = () => {
    const text = `*New Travel Enquiry - ${companyName}*

*Name:* ${formData.fullName}
*Phone:* ${formData.mobileNumber}
*Service:* ${formData.serviceType}
*Pickup:* ${formData.pickupLocation}
*Destination:* ${formData.destination}
*Date:* ${formData.travelDate}
*Passengers:* ${formData.passengers}
${
  formData.message
    ? `*Notes:* ${formData.message}`
    : ''
}`;

    return getWhatsAppUrl(text);
  };

  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {
    setSubmitted(false);

    setFormData({
      fullName: '',
      mobileNumber: '',
      pickupLocation: '',
      destination: '',
      travelDate: '',
      passengers: '1',
      serviceType: 'Car with Driver',
      message: '',
    });

    setErrors({});
  };

  // =====================================================
  // SETTINGS LOADING
  // =====================================================

  if (settingsLoading) {
    return (
      <section
        id="booking"
        className="py-20 bg-gradient-to-b from-navy-950 via-navy-900 to-slate-900 text-white"
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-300">
            Loading booking options...
          </p>
        </div>
      </section>
    );
  }

  // =====================================================
  // ONLINE BOOKING DISABLED
  // =====================================================

  if (!onlineBooking) {
    return (
      <section
        id="booking"
        className="py-20 bg-gradient-to-b from-navy-950 via-navy-900 to-slate-900 text-white"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="bg-white text-slate-900 rounded-3xl p-8 sm:p-12 shadow-2xl text-center">

            <div className="w-16 h-16 rounded-full bg-yellow-100 text-yellow-600 mx-auto flex items-center justify-center">
              <AlertCircle className="w-9 h-9" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-navy-900 mt-6">
              Online Booking Is Currently Unavailable
            </h2>

            <p className="text-sm sm:text-base text-slate-600 mt-3 max-w-lg mx-auto">
              Online booking requests are temporarily
              unavailable. Please contact {companyName}
              directly for your travel requirements.
            </p>

            {/* CONTACT OPTIONS */}

            <div className="flex flex-col sm:flex-row justify-center gap-3 mt-7">

              {/* WHATSAPP */}

              {whatsappBooking &&
                whatsappNumber && (
                  <a
                    href={getWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    WhatsApp Us
                  </a>
                )}

              {/* CALL */}

              {callBooking &&
                phoneNumber && (
                  <a
                    href={`tel:${phoneNumber}`}
                    className="px-6 py-3 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-sm flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    Call Us
                  </a>
                )}

            </div>

          </div>

        </div>
      </section>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <section
      id="booking"
      className="py-20 bg-gradient-to-b from-navy-950 via-navy-900 to-slate-900 text-white relative"
    >

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* =================================================
              LEFT COLUMN
          ================================================= */}

          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">

            <span className="px-3.5 py-1.5 rounded-full bg-gold-500/20 border border-gold-500/30 text-gold-400 text-xs font-bold uppercase tracking-wider">
              Easy Online Booking
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Plan Your Journey With Us
            </h2>

            <p className="text-slate-300 text-base leading-relaxed">
              Submit your journey details below to
              receive a personalized quote from{' '}
              {companyName}.
            </p>

            {/* FEATURE 1 */}

            <div className="space-y-4 pt-4 border-t border-navy-800">

              <div className="flex items-start gap-3">

                <div className="w-8 h-8 rounded-lg bg-gold-500/20 text-gold-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-5 h-5" />
                </div>

                <div>

                  <h4 className="text-sm font-bold text-white">
                    Chauffeur Driven Comfort
                  </h4>

                  <p className="text-xs text-slate-400">
                    Professional, route-experienced
                    driver provided for all trips.
                  </p>

                </div>

              </div>

              {/* FEATURE 2 */}

              <div className="flex items-start gap-3">

                <div className="w-8 h-8 rounded-lg bg-gold-500/20 text-gold-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-5 h-5" />
                </div>

                <div>

                  <h4 className="text-sm font-bold text-white">
                    Clean & Sanitized Vehicle
                  </h4>

                  <p className="text-xs text-slate-400">
                    Maintained Suzuki Ertiga ready
                    for local or outstation tours.
                  </p>

                </div>

              </div>

            </div>

            {/* =================================================
                WHATSAPP
            ================================================= */}

            {whatsappBooking &&
              whatsappNumber && (
                <div className="p-4 rounded-xl bg-navy-800/80 border border-navy-700 space-y-2 text-xs">

                  <span className="text-gold-400 font-bold block uppercase tracking-wider">
                    Prefer Instant Chat?
                  </span>

                  <p className="text-slate-300">
                    Click below to message us directly
                    on WhatsApp with your travel
                    requirements.
                  </p>

                  <a
                    href={getWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-emerald-400 font-bold hover:underline pt-1"
                  >
                    <MessageSquare className="w-4 h-4" />

                    <span>
                      Open WhatsApp Chat
                    </span>
                  </a>

                </div>
              )}

            {/* =================================================
                CALL
            ================================================= */}

            {callBooking &&
              phoneNumber && (
                <div className="p-4 rounded-xl bg-navy-800/80 border border-navy-700 space-y-2 text-xs">

                  <span className="text-gold-400 font-bold block uppercase tracking-wider">
                    Prefer a Phone Call?
                  </span>

                  <p className="text-slate-300">
                    Speak directly with us for your
                    travel requirements and booking
                    assistance.
                  </p>

                  <a
                    href={`tel:${phoneNumber}`}
                    className="inline-flex items-center gap-2 text-gold-400 font-bold hover:underline pt-1"
                  >
                    <Phone className="w-4 h-4" />

                    <span>
                      Call Us Now
                    </span>
                  </a>

                </div>
              )}

          </div>

          {/* =================================================
              RIGHT COLUMN
          ================================================= */}

          <div className="lg:col-span-7 bg-white text-slate-900 rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-200">

            {submitted ? (

              /* =================================================
                  SUCCESS
              ================================================= */

              <div className="text-center py-10 space-y-6">

                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-2">

                  <h3 className="text-2xl font-bold text-navy-900">
                    Enquiry Received!
                  </h3>

                  <p className="text-sm text-slate-600 max-w-md mx-auto">
                    Thank you{' '}
                    <strong>
                      {formData.fullName}
                    </strong>
                    . We have received your
                    journey request from{' '}
                    <strong>
                      {formData.pickupLocation}
                    </strong>{' '}
                    to{' '}
                    <strong>
                      {formData.destination}
                    </strong>{' '}
                    for{' '}
                    <strong>
                      {formData.travelDate}
                    </strong>
                    .
                  </p>

                </div>

                <div className="bg-slate-50 p-4 rounded-xl text-xs text-slate-700 space-y-1 text-left border border-slate-200 max-w-md mx-auto">

                  <p>
                    <strong>Service:</strong>{' '}
                    {formData.serviceType}
                  </p>

                  <p>
                    <strong>Passengers:</strong>{' '}
                    {formData.passengers}
                  </p>

                  <p>
                    <strong>Mobile:</strong>{' '}
                    {formData.mobileNumber}
                  </p>

                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">

                  {/* WHATSAPP */}

                  {whatsappBooking &&
                    whatsappNumber && (
                      <a
                        href={constructWhatsAppMessage()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        <MessageSquare className="w-4 h-4" />

                        <span>
                          Send directly to WhatsApp
                        </span>

                      </a>
                    )}

                  {/* CALL */}

                  {callBooking &&
                    phoneNumber && (
                      <a
                        href={`tel:${phoneNumber}`}
                        className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        <Phone className="w-4 h-4" />

                        <span>
                          Call Us
                        </span>

                      </a>
                    )}

                  {/* RESET */}

                  <button
                    onClick={resetForm}
                    type="button"
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-sm transition-all"
                  >
                    Submit Another Enquiry
                  </button>

                </div>

              </div>

            ) : (

              /* =================================================
                  FORM
              ================================================= */

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
                noValidate
              >

                <div className="border-b border-slate-200 pb-4 mb-2">

                  <h3 className="text-xl font-bold text-navy-900">
                    Travel Details Form
                  </h3>

                  <p className="text-xs text-slate-500">
                    Fill in the required information
                    for quick quote assistance.
                  </p>

                </div>

                {/* NAME + MOBILE */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  {/* NAME */}

                  <div className="space-y-1.5">

                    <label
                      htmlFor="fullName"
                      className="block text-xs font-bold text-slate-700"
                    >
                      Full Name{' '}
                      <span className="text-red-500">
                        *
                      </span>
                    </label>

                    <div className="relative">

                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                          errors.fullName
                            ? 'border-red-400 focus:ring-red-200'
                            : 'border-slate-300 focus:border-navy-800 focus:ring-navy-100'
                        }`}
                      />

                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />

                    </div>

                    {errors.fullName && (
                      <p className="text-[11px] text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.fullName}
                      </p>
                    )}

                  </div>

                  {/* MOBILE */}

                  <div className="space-y-1.5">

                    <label
                      htmlFor="mobileNumber"
                      className="block text-xs font-bold text-slate-700"
                    >
                      Mobile Number{' '}
                      <span className="text-red-500">
                        *
                      </span>
                    </label>

                    <div className="relative">

                      <input
                        type="tel"
                        id="mobileNumber"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        placeholder="Enter 10-digit mobile number"
                        maxLength="10"
                        inputMode="numeric"
                        className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                          errors.mobileNumber
                            ? 'border-red-400 focus:ring-red-200'
                            : 'border-slate-300 focus:border-navy-800 focus:ring-navy-100'
                        }`}
                      />

                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />

                    </div>

                    {errors.mobileNumber && (
                      <p className="text-[11px] text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.mobileNumber}
                      </p>
                    )}

                  </div>

                </div>

                {/* PICKUP + DESTINATION */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  {/* PICKUP */}

                  <div className="space-y-1.5">

                    <label
                      htmlFor="pickupLocation"
                      className="block text-xs font-bold text-slate-700"
                    >
                      Pickup Location{' '}
                      <span className="text-red-500">
                        *
                      </span>
                    </label>

                    <div className="relative">

                      <input
                        type="text"
                        id="pickupLocation"
                        name="pickupLocation"
                        value={
                          formData.pickupLocation
                        }
                        onChange={handleChange}
                        placeholder="e.g. City / Airport / Hotel"
                        className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                          errors.pickupLocation
                            ? 'border-red-400 focus:ring-red-200'
                            : 'border-slate-300 focus:border-navy-800 focus:ring-navy-100'
                        }`}
                      />

                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />

                    </div>

                    {errors.pickupLocation && (
                      <p className="text-[11px] text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.pickupLocation}
                      </p>
                    )}

                  </div>

                  {/* DESTINATION */}

                  <div className="space-y-1.5">

                    <label
                      htmlFor="destination"
                      className="block text-xs font-bold text-slate-700"
                    >
                      Destination{' '}
                      <span className="text-red-500">
                        *
                      </span>
                    </label>

                    <div className="relative">

                      <input
                        type="text"
                        id="destination"
                        name="destination"
                        value={
                          formData.destination
                        }
                        onChange={handleChange}
                        placeholder="e.g. Outstation city / Sightseeing"
                        className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                          errors.destination
                            ? 'border-red-400 focus:ring-red-200'
                            : 'border-slate-300 focus:border-navy-800 focus:ring-navy-100'
                        }`}
                      />

                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />

                    </div>

                    {errors.destination && (
                      <p className="text-[11px] text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.destination}
                      </p>
                    )}

                  </div>

                </div>

                {/* DATE + PASSENGERS + SERVICE */}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                  {/* DATE */}

                  <div className="space-y-1.5">

                    <label
                      htmlFor="travelDate"
                      className="block text-xs font-bold text-slate-700"
                    >
                      Travel Date{' '}
                      <span className="text-red-500">
                        *
                      </span>
                    </label>

                    <div className="relative">

                      <input
                        type="date"
                        id="travelDate"
                        name="travelDate"
                        value={
                          formData.travelDate
                        }
                        onChange={handleChange}
                        min={
                          new Date()
                            .toISOString()
                            .split('T')[0]
                        }
                        className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                          errors.travelDate
                            ? 'border-red-400 focus:ring-red-200'
                            : 'border-slate-300 focus:border-navy-800 focus:ring-navy-100'
                        }`}
                      />

                      <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />

                    </div>

                    {errors.travelDate && (
                      <p className="text-[11px] text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.travelDate}
                      </p>
                    )}

                  </div>

                  {/* PASSENGERS */}

                  <div className="space-y-1.5">

                    <label
                      htmlFor="passengers"
                      className="block text-xs font-bold text-slate-700"
                    >
                      Passengers
                    </label>

                    <div className="relative">

                      <select
                        id="passengers"
                        name="passengers"
                        value={
                          formData.passengers
                        }
                        onChange={handleChange}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-navy-800 focus:ring-2 focus:ring-navy-100 bg-white"
                      >

                        <option value="1">
                          1 Passenger
                        </option>

                        <option value="2">
                          2 Passengers
                        </option>

                        <option value="3">
                          3 Passengers
                        </option>

                        <option value="4">
                          4 Passengers
                        </option>

                        <option value="5">
                          5 Passengers
                        </option>

                        <option value="6">
                          6 Passengers
                        </option>

                        <option value="7">
                          7 Passengers (Max Ertiga)
                        </option>

                      </select>

                      <Users className="w-4 h-4 text-slate-400 absolute left-3 top-3" />

                    </div>

                    {errors.passengers && (
                      <p className="text-[11px] text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.passengers}
                      </p>
                    )}

                  </div>

                  {/* SERVICE */}

                  <div className="space-y-1.5">

                    <label
                      htmlFor="serviceType"
                      className="block text-xs font-bold text-slate-700"
                    >
                      Service Type
                    </label>

                    <div className="relative">

                      <select
                        id="serviceType"
                        name="serviceType"
                        value={
                          formData.serviceType
                        }
                        onChange={handleChange}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-navy-800 focus:ring-2 focus:ring-navy-100 bg-white"
                      >

                        {serviceOptions.map(
                          (opt) => (
                            <option
                              key={opt}
                              value={opt}
                            >
                              {opt}
                            </option>
                          )
                        )}

                      </select>

                      <Car className="w-4 h-4 text-slate-400 absolute left-3 top-3" />

                    </div>

                  </div>

                </div>

                {/* MESSAGE */}

                <div className="space-y-1.5">

                  <label
                    htmlFor="message"
                    className="block text-xs font-bold text-slate-700"
                  >
                    Additional Message /
                    Special Requirements
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    rows="3"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Mention return date, flight timing, or extra stops..."
                    className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-navy-800 focus:ring-navy-100"
                  />

                </div>

                {/* SUBMIT */}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 rounded-xl text-navy-950 font-bold text-base shadow-md transition-all flex items-center justify-center gap-2 ${
                    isSubmitting
                      ? 'bg-slate-300 cursor-not-allowed'
                      : 'bg-gold-500 hover:bg-gold-400 active:scale-95'
                  }`}
                >

                  <Send className="w-5 h-5" />

                  <span>
                    {isSubmitting
                      ? 'Submitting...'
                      : 'Send Enquiry'}
                  </span>

                </button>

              </form>

            )}

          </div>

        </div>

      </div>

    </section>
  );
};

export default BookingForm;