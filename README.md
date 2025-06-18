# StayFinder Frontend

This is the React client for the StayFinder full-stack web application, a platform for listing and booking properties, similar to Airbnb. This project demonstrates skills in building interactive user interfaces, managing state, routing, and consuming RESTful APIs.

---

## Features

-   **Homepage:** Browse a collection of property cards displaying images, location, and price.
-   **Property Details Page:** View comprehensive information about a specific listing, including a gallery of images, detailed description, amenities, host information, and an interactive calendar for checking availability and making bookings.
-   **User Authentication:**
    -   **Login Page:** Secure user login with client-side validation.
    -   **Register Page:** User registration with client-side password matching validation.
-   **User Profile:** Authenticated users can view and manage their profile.
-   **My Bookings:** Authenticated users can view a list of their past and upcoming bookings.
-   **Host Dashboard:**
    -   **Manage Listings:** Hosts can view, add, edit, and delete their properties.
    -   **Add New Listing:** A form to create new property listings with all relevant details.
    -   **Edit Listing:** Functionality to update existing property details.
-   **Protected Routes:** Ensures only authenticated users can access certain parts of the application (e.g., profile, bookings, host dashboard).
-   **Host-Specific Routes:** Restricts host functionalities to authorized host users.

---

## Technologies Used

-   **React:** Frontend JavaScript library for building user interfaces.
-   **React Router DOM:** For declarative routing within the application.
-   **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
-   **Axios:** Promise-based HTTP client for making API requests.
-   **React Toastify:** For displaying stylish notifications (e.g., success, error messages).
-   **Date-fns:** A modern JavaScript date utility library.
-   **React Datepicker:** A flexible and customizable date picker component.
-   **Heroicons:** A set of beautiful SVG icons.

---

## Getting Started

Follow these steps to get the StayFinder frontend running on your local machine.

### Prerequisites

-   Node.js (v18 or higher recommended)
-   npm (Node Package Manager)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [YOUR_FRONTEND_GITHUB_REPO_URL]
    cd front # or whatever your frontend folder is named
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create a `.env` file:**
    In the root of the frontend directory (`/front`), create a file named `.env`.
    ```env
    # Example .env file for frontend
    REACT_APP_API_URL=http://localhost:5000/api
    # If your backend is deployed, use its URL:
    # REACT_APP_API_URL=[https://your-deployed-backend-api.render.com/api](https://your-deployed-backend-api.render.com/api)
    ```
    Replace `http://localhost:5000/api` with your actual backend API URL.

### Running the Application

To start the development server:
```bash
npm run dev
