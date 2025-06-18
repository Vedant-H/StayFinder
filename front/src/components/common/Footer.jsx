// src/components/Common/Footer.jsx

import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white p-6 mt-12">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left">
        {/* Left Section: Copyright */}
        <div className="mb-4 md:mb-0">
          <p>&copy; {currentYear} StayFinder. All rights reserved.</p>
        </div>

        {/* Center Section: Navigation/Links (Optional) */}
        <div className="mb-4 md:mb-0">
          <ul className="flex flex-wrap justify-center md:justify-start space-x-4">
            <li><a href="/about" className="hover:text-gray-400 transition-colors duration-200">About Us</a></li>
            <li><a href="/contact" className="hover:text-gray-400 transition-colors duration-200">Contact</a></li>
            <li><a href="/privacy" className="hover:text-gray-400 transition-colors duration-200">Privacy Policy</a></li>
            <li><a href="/terms" className="hover:text-gray-400 transition-colors duration-200">Terms of Service</a></li>
          </ul>
        </div>

        {/* Right Section: Social Media Icons (Optional) */}
        <div>
          <ul className="flex justify-center md:justify-start space-x-4">
            <li>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors duration-200">
                <i className="fab fa-facebook-f"></i> {/* Requires Font Awesome */}
                Facebook
              </a>
            </li>
            <li>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors duration-200">
                <i className="fab fa-twitter"></i> {/* Requires Font Awesome */}
                Twitter
              </a>
            </li>
            <li>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors duration-200">
                <i className="fab fa-instagram"></i> {/* Requires Font Awesome */}
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;