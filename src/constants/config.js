/**
 * Centralized Configuration & Data Store for Family Tours & Travels
 * All business placeholders are structured here for easy client customization.
 */

export const API_URL =
  "https://family-tours-travels-backend-production.up.railway.app";

export const BUSINESS_CONFIG = {
  name: "Family Tours & Travels",
  tagline: "Your Journey, Our Responsibility.",
  subTagline: "Comfortable and reliable car-with-driver services for local trips, outstation journeys, airport transfers and memorable tour experiences.",
  vehicleName: "Suzuki Ertiga",
  serviceTypeNote: "Dedicated Car-with-Driver Services (Not a self-drive rental)",
  
  // Business Contact Placeholders (To be replaced by client)
  phone: "916302784238",
  whatsapp: "916302784238",
  email: "chowtie88@gmail.com",
  location: "SERILINAGAMPALLY , HYDERABAD, INDIA",
  workingHours: "24/7 Enquiry Support",
};

/**
 * Generate standard WhatsApp click-to-chat URL
 * @param {string} customMessage Optional pre-filled text
 */
export const getWhatsAppLink = (customMessage = "") => {
  const encodedMsg = encodeURIComponent(
    customMessage || "Hello Family Tours & Travels! I would like to enquire about your car-with-driver service."
  );
  // Using standard placeholder structure or default wa.me format
  return `https://wa.me/${BUSINESS_CONFIG.whatsapp}?text=${encodedMsg}`;
};

export const SERVICES = [
  {
    id: "car-with-driver",
    title: "Car with Driver",
    description: "Travel stress-free with a professional, courteous driver dedicated to your journey.",
    icon: "Car",
    highlight: "Primary Service",
  },
  {
    id: "local-trips",
    title: "Local Trips",
    description: "Convenient transportation for city travel, shopping, family visits, and local sightseeing.",
    icon: "MapPin",
    highlight: "Hourly / Daily",
  },
  {
    id: "outstation-trips",
    title: "Outstation Trips",
    description: "Comfortable, safe car travel for long-distance journeys outside your local area.",
    icon: "Compass",
    highlight: "Round Trips & One Way",
  },
  {
    id: "airport-transfers",
    title: "Airport Pickup & Drop",
    description: "Punctual, hassle-free transportation for airport arrivals and departures.",
    icon: "Plane",
    highlight: "24/7 Timely Pickup",
  },
  {
    id: "tour-packages",
    title: "Tour Packages by Car",
    description: "Explore tourist spots and scenic destinations through customized car-based tour plans.",
    icon: "Camera",
    highlight: "Customized Itineraries",
  },
  {
    id: "online-booking",
    title: "Online Booking / Enquiry",
    description: "Submit your travel plan and receive instant quote response for your trip.",
    icon: "CalendarCheck",
    highlight: "Quick Response",
  },
  {
    id: "whatsapp-support",
    title: "WhatsApp / Call Now",
    description: "Direct instant contact with driver service manager for urgent bookings.",
    icon: "MessageSquare",
    highlight: "Instant Assistance",
  },
  {
    id: "customer-satisfaction",
    title: "Customer Focused",
    description: "Tailored around family comfort, safety, and clean sanitization standards.",
    icon: "HeartHandshake",
    highlight: "Family First",
  },
];

export const VEHICLE_DETAILS = {
  name: "Suzuki Ertiga",
  type: "Premium 7-Seater MPV",
  headline: "Travel Comfortably in Our Suzuki Ertiga",
  image: "/ertiga-hero.jpg",
  interiorImage: "/ertiga-interior.jpg",
  features: [
    { title: "Driver Included", desc: "Professional driver for a relaxed travel experience", icon: "UserCheck" },
    { title: "Spacious Comfort", desc: "Ample room for families & group passengers", icon: "Users" },
    { title: "Dual AC Comfort", desc: "Front and rear air conditioning for all weather", icon: "Wind" },
    { title: "Clean & Sanitized", desc: "Hygienic, well-maintained vehicle before every trip", icon: "Sparkles" },
  ],
  specsPlaceholder: [
    { label: "Seating Capacity", value: "[SEATING_CAPACITY]" },
    { label: "Luggage Capacity", value: "[LUGGAGE_SPACE]" },
    { label: "Fuel/AC Type", value: "[AC_SPECIFICATION]" },
    { label: "Vehicle Rate", value: "[PRICE_PER_KM]" },
  ]
};

export const TOUR_PACKAGES = [
  {
    id: 1,
    title: "[TOUR_DESTINATION_1]",
    duration: "[DURATION]",
    vehicle: "Suzuki Ertiga with Driver",
    description: "[PACKAGE_DESCRIPTION_1] Perfect for weekend family getaways, scenic sightseeing and temple tours.",
    price: "[PRICE]",
    highlights: ["Driver Included", "Flexible Sightseeing Stops", "Doorstep Pickup"],
  },
  {
    id: 2,
    title: "[TOUR_DESTINATION_2]",
    duration: "[DURATION]",
    vehicle: "Suzuki Ertiga with Driver",
    description: "[PACKAGE_DESCRIPTION_2] Outstation tour package covering major tourist attractions with comfortable stops.",
    price: "[PRICE]",
    highlights: ["Customized Route", "Luggage Support", "Family Friendly"],
  },
  {
    id: 3,
    title: "[TOUR_DESTINATION_3]",
    duration: "[DURATION]",
    vehicle: "Suzuki Ertiga with Driver",
    description: "[PACKAGE_DESCRIPTION_3] Relaxing holiday itinerary designed around custom travel pace and preferences.",
    price: "[PRICE]",
    highlights: ["All-Inclusive Toll Plan", "Experienced Route Driver", "Safe Travel"],
  },
];

export const WHY_CHOOSE_US = [
  {
    title: "Comfortable Travel",
    description: "Designed around a smooth and comfortable travel experience in our spacious Suzuki Ertiga.",
    icon: "ShieldCheck",
  },
  {
    title: "Experienced Drivers",
    description: "Professional, polite, and well-trained driver service focused on passenger safety and comfort.",
    icon: "Award",
  },
  {
    title: "Reliable Service",
    description: "Punctual pick-ups and dependable travel arrangements for local, outstation, and airport needs.",
    icon: "Clock",
  },
  {
    title: "Family Friendly",
    description: "Safe, courteous, and relaxing travel environment tailored for families, seniors, and children.",
    icon: "Heart",
  },
];
