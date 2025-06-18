---

## **Backend README.md**

```markdown
# StayFinder Backend API

This is the Node.js and Express.js backend API for the StayFinder full-stack web application. It provides a robust RESTful API for managing user authentication, property listings, and booking reservations, interacting with a MongoDB database.

---

## Features & Endpoints

This API provides the following functionalities:

### User Authentication
-   `POST /api/users/register`: Register a new user.
-   `POST /api/users/login`: Authenticate and log in a user, returning a JWT.
-   `GET /api/users/profile`: Get authenticated user's profile (protected route).

### Listing Management (CRUD for Hosts)
-   `GET /api/listings`: Retrieve all available property listings.
-   `GET /api/listings/:id`: Retrieve details for a specific property listing.
-   `POST /api/listings`: Create a new property listing (protected, host only).
-   `PUT /api/listings/:id`: Update an existing property listing (protected, host only).
-   `DELETE /api/listings/:id`: Delete a property listing (protected, host only).
-   `GET /api/listings/host`: Get all listings owned by the authenticated host.

### Booking System
-   `POST /api/bookings`: Create a new booking reservation (protected).
-   `GET /api/bookings/my-bookings`: Retrieve all bookings made by the authenticated user (protected).
-   `GET /api/bookings/:id`: Get details for a specific booking (protected).
-   `PUT /api/bookings/:id/cancel`: Cancel a booking (protected).

---

## Technologies Used

-   **Node.js:** JavaScript runtime.
-   **Express.js:** Web framework for Node.js.
-   **MongoDB:** NoSQL database for data storage.
-   **Mongoose:** ODM (Object Data Modeling) library for MongoDB and Node.js.
-   **JSON Web Token (JWT):** For secure user authentication.
-   **Bcrypt.js:** For password hashing.
-   **Express Async Handler:** Simple middleware for handling exceptions in Express async routes.
-   **Express Validator:** For request data validation.
-   **Dotenv:** To load environment variables from a `.env` file.

---

## Getting Started

Follow these steps to set up and run the StayFinder backend API on your local machine.

### Prerequisites

-   Node.js (v18 or higher recommended)
-   npm (Node Package Manager)
-   MongoDB (local installation or cloud-hosted instance like MongoDB Atlas)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Vedant-H/StayFinder.git/back
    cd back # or whatever your backend folder is named
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create a `.env` file:**
    In the root of the backend directory (`/back`), create a file named `.env`.

    ```env
    # Example .env file for backend
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=a_very_strong_and_long_secret_key_for_jwt
    PORT=5000
    ```
    -   Replace `your_mongodb_connection_string` with your MongoDB URI (e.g., `mongodb://localhost:27017/stayfinder` for local, or your Atlas connection string).
    -   Replace `a_very_strong_and_long_secret_key_for_jwt` with a strong, random string (e.g., generated from `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`).

### Running the Application

To start the development server with Nodemon (for auto-restarts):
```bash
npm run dev
