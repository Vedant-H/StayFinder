import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { HomeIcon, ArrowRightOnRectangleIcon, UserPlusIcon, RocketLaunchIcon, CalendarDaysIcon } from '@heroicons/react/24/outline'; // Example icons

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-300 hover:text-blue-200 transition-colors duration-200">
          StayFinder
        </Link>
        <nav className="flex items-center space-x-6">
          <Link to="/" className="flex items-center hover:text-gray-300 transition-colors duration-200">
            <HomeIcon className="h-5 w-5 mr-1" /> Home
          </Link>

          {isAuthenticated ? (
            <>
              {user?.role === 'host' && (
                <Link to="/host/dashboard" className="flex items-center hover:text-gray-300 transition-colors duration-200">
                  <RocketLaunchIcon className="h-5 w-5 mr-1" /> Host Dashboard
                </Link>
              )}
              <Link to="/my-bookings" className="flex items-center hover:text-gray-300 transition-colors duration-200">
                  <CalendarDaysIcon className="h-5 w-5 mr-1" /> My Bookings
                </Link>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-1 bg-red-600 rounded-md hover:bg-red-700 transition-colors duration-200"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="flex items-center hover:text-gray-300 transition-colors duration-200">
                <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1" /> Login
              </Link>
              <Link to="/register" className="flex items-center px-3 py-1 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200">
                <UserPlusIcon className="h-5 w-5 mr-1" /> Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;