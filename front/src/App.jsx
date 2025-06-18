import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ListingDetailPage from './pages/ListingDetailPage';
import HostDashboardPage from './pages/HostDashboardPage';
import Header from "./components/common/Header"
import PrivateRoute from './components/common/PrivateRoute';
import HostRoute from './components/common/HostRoute'; // New component
import ListingForm from './components/Listings/ListingForm';
import MyBookingsPage from './pages/MyBookingsPage'; // New Page
import EditListingPage from './pages/EditListingPage'; // New Page for editing listings
import Footer from './components/common/Footer'

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/listings/:id" element={<ListingDetailPage />} />

            {/* Protected Routes */}
            <Route path="/my-bookings" element={<PrivateRoute><MyBookingsPage /></PrivateRoute>} />

            {/* Host Protected Routes */}
            <Route path="/host/dashboard" element={<HostRoute><HostDashboardPage /></HostRoute>} />
            <Route path="/host/listings/new" element={<HostRoute><ListingForm /></HostRoute>} />
            <Route path="/host/listings/edit/:id" element={<HostRoute><EditListingPage /></HostRoute>} />
          </Routes>
        </main>
         <Footer /> 
      </div>
    </Router>
  );
}

export default App;