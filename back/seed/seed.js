require('dotenv').config({ path: '../.env' }); // Load .env from parent directory
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Listing = require('../models/Listing');
const Booking = require('../models/Booking');
const connectDB = require('../config/db');

connectDB(); // Connect to MongoDB

const seedData = async () => {
  try {
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Listing.deleteMany({});
    await Booking.deleteMany({});
    console.log('Existing data cleared.');

    // 1. Create Users
    const hashedPassword1 = await bcrypt.hash('password123', 10);
    const hashedPassword2 = await bcrypt.hash('password123', 10);

    const users = await User.insertMany([
      {
        username: 'john_doe',
        email: 'john@example.com',
        password: hashedPassword1,
        role: 'guest',
      },
      {
        username: 'jane_host',
        email: 'jane@example.com',
        password: hashedPassword2,
        role: 'host',
      },
      {
        username: 'peter_guest',
        email: 'peter@example.com',
        password: hashedPassword1,
        role: 'guest',
      },
    ]);

    const john = users.find(user => user.username === 'john_doe');
    const jane = users.find(user => user.username === 'jane_host');
    const peter = users.find(user => user.username === 'peter_guest');

    console.log('Users created.');

    // 2. Create Listings
const listings = await Listing.insertMany([
      {
        title: 'Cozy Apartment in Paris',
        description: 'A charming apartment located in the heart of Paris, perfect for a romantic getaway.',
        pricePerNight: 150,
        location: 'Paris, France',
        images: [
          'https://q-xx.bstatic.com/xdata/images/hotel/max1024x768/76066280.jpg?k=a2465fae27a7fbe18bec0a5569abc98f2f4d428eaaf9caf4f701fce4b7e5bdbf&o=', // Cozy Paris interior
          'https://q-xx.bstatic.com/xdata/images/hotel/max1024x768/76066280.jpg?k=a2465fae27a7fbe18bec0a5569abc98f2f4d428eaaf9caf4f701fce4b7e5bdbf&o=', // Parisian balcony view
        ],
        amenities: ['WiFi', 'Kitchen', 'TV'],
        host: jane._id,
        maxGuests: 2,
        bedrooms: 1,
        beds: 1,
        bathrooms: 1,
        availableDates: [
          new Date('2025-07-01'), new Date('2025-07-02'), new Date('2025-07-03'),
          new Date('2025-07-10'), new Date('2025-07-11'),
        ],
      },
      {
        title: 'Modern Loft in New York City',
        description: 'Spacious and stylish loft in NYC, close to all major attractions.',
        pricePerNight: 250,
        location: 'New York, USA',
        images: [
          'https://media.istockphoto.com/id/696919864/photo/modern-loft-apartment-3d-rendering.jpg?s=612x612&w=0&k=20&c=snCd0B5eywqzwELIKtVgvIYs80xCup62LUvSt5GWavw=', // NYC modern loft interior
          'https://media.istockphoto.com/id/696919864/photo/modern-loft-apartment-3d-rendering.jpg?s=612x612&w=0&k=20&c=snCd0B5eywqzwELIKtVgvIYs80xCup62LUvSt5GWavw=', // NYC loft living area
        ],
        amenities: ['WiFi', 'Kitchen', 'Washer', 'Dryer', 'Gym'],
        host: jane._id,
        maxGuests: 4,
        bedrooms: 2,
        beds: 2,
        bathrooms: 1.5,
        availableDates: [
          new Date('2025-08-01'), new Date('2025-08-02'), new Date('2025-08-03'),
          new Date('2025-08-15'), new Date('2025-08-16'),
        ],
      },
      {
        title: 'Beachfront Villa in Bali',
        description: 'Luxurious villa with private beach access and stunning ocean views.',
        pricePerNight: 400,
        location: 'Bali, Indonesia',
        images: [
          'https://balivillaescapes.com.au/wp-content/uploads/2024/11/BaliAmoriVista_Seseh_Bali_10_OutdoorLiving-540x345.jpg.webp', // Bali villa pool with ocean
          'https://balivillaescapes.com.au/wp-content/uploads/2024/11/BaliAmoriVista_Seseh_Bali_10_OutdoorLiving-540x345.jpg.webp', // Bali beachfront exterior
        ],
        amenities: ['Private Pool', 'WiFi', 'Kitchen', 'Parking', 'Air Conditioning'],
        host: jane._id,
        maxGuests: 6,
        bedrooms: 3,
        beds: 3,
        bathrooms: 3,
        availableDates: [
          new Date('2025-09-01'), new Date('2025-09-02'), new Date('2025-09-03'),
          new Date('2025-09-10'), new Date('2025-09-11'),
        ],
      },
      {
        title: 'Charming Cottage in English Countryside',
        description: 'Escape to this quaint cottage in the serene English countryside.',
        pricePerNight: 120,
        location: 'Cotswolds, UK',
        images: [
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx1R8JShTgvQifxOPoaKvCA8M3coFhK16ZJQ&s', // Cotswolds cottage exterior
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx1R8JShTgvQifxOPoaKvCA8M3coFhK16ZJQ&s', // Cottage interior
        ],
        amenities: ['Fireplace', 'Garden', 'Parking'],
        host: jane._id,
        maxGuests: 3,
        bedrooms: 2,
        beds: 2,
        bathrooms: 1,
        availableDates: [
          new Date('2025-10-01'), new Date('2025-10-02'), new Date('2025-10-03'),
          new Date('2025-10-15'), new Date('2025-10-16'),
        ],
      },
      {
        title: 'Ski Chalet in Swiss Alps',
        description: 'Beautiful chalet with direct access to ski slopes and breathtaking mountain views.',
        pricePerNight: 300,
        location: 'Verbier, Switzerland',
        images: [
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRj7HxtONNdUWRZKHG9y4EeKvOcS3R9k-Hdwg&s', // Ski chalet exterior
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRj7HxtONNdUWRZKHG9y4EeKvOcS3R9k-Hdwg&s', // Chalet interior with view
        ],
        amenities: ['Ski-in/Ski-out', 'Fireplace', 'Sauna', 'WiFi'],
        host: jane._id,
        maxGuests: 8,
        bedrooms: 4,
        beds: 5,
        bathrooms: 2.5,
        availableDates: [
          new Date('2025-12-01'), new Date('2025-12-02'), new Date('2025-12-03'),
          new Date('2025-12-10'), new Date('2025-12-11'),
        ],
      },
    ]);

    const parisApartment = listings[0];
    const nycLoft = listings[1];

    console.log('Listings created.');

    // 3. Create Bookings
    await Booking.insertMany([
      {
        listing: parisApartment._id,
        user: john._id,
        checkInDate: new Date('2025-07-01'),
        checkOutDate: new Date('2025-07-03'),
        totalPrice: parisApartment.pricePerNight * 2, // 2 nights
        numberOfGuests: 2,
        status: 'confirmed',
      },
      {
        listing: nycLoft._id,
        user: peter._id,
        checkInDate: new Date('2025-08-01'),
        checkOutDate: new Date('2025-08-03'),
        totalPrice: nycLoft.pricePerNight * 2, // 2 nights
        numberOfGuests: 3,
        status: 'pending',
      },
    ]);
    console.log('Bookings created.');

    console.log('Seed data successfully inserted!');
    process.exit();
  } catch (error) {
    console.error(`Error seeding data: ${error.message}`);
    process.exit(1);
  }
};

seedData();