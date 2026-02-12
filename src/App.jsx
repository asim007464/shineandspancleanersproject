import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// --- Components ---
import Footer from "./Components/Homecomponents/Footer";
import ScrollToTop from "./ScrollToTop";
// --- Pages ---
import PrivacyPolicy from "./pages/PrivacyPolicy";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Apply from "./pages/Apply";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Referral from "./pages/Referral";
import Signup from "./pages/Signup";
import WebsiteGuard from "./pages/WebsiteGuard";
import TermsAndConditions from "./pages/TermsAndConditions";
import Admin from "./pages/Admin";
import ProtectedRoute from "./Components/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <WebsiteGuard></WebsiteGuard>
      {/* Resets scroll position to top on every route change */}
      <ScrollToTop />
      {/* Global Navbar */}
      <div className="min-h-screen">
        <Routes>
          {/* Main Page with Employer Info & Apply Button */}
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          {/* About Page: Mission & Culture */}
          <Route path="/about" element={<About />} />
          {/* Contact Page */}
          <Route path="/contact" element={<Contact />} />
          {/* Worker Login: Separate from Apply Now */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/TermsAndConditions" element={<TermsAndConditions />} />

          {/* Auth-protected routes */}
          <Route path="/apply" element={<ProtectedRoute requireAuth><Apply /></ProtectedRoute>} />
          <Route path="/referral" element={<ProtectedRoute requireAuth><Referral /></ProtectedRoute>} />

          {/* Admin-only route */}
          <Route path="/admin" element={<ProtectedRoute requireAdmin><Admin /></ProtectedRoute>} />

          {/* Catch-all — redirect unknown paths to home */}
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
