# Food Ordering System

A full-stack MERN application for food ordering with a functional shopping cart, responsive design, and complete keyboard navigation.

## Features

- **User Authentication**
  - JWT token-based authentication
  - Role-based access control (Admin and User roles)

- **Admin Dashboard**
  - Intuitive interface for product management
  - Add items
  - Upload and manage product images
  - Configure prices and titles

- **Product Catalog**
  - Responsive grid layout for product display
  - Beautiful product cards with images and details

- **Shopping Cart**
  - Add/remove items
  - Increase/decrease quantities
  - Real-time cart updates

- **Order Processing**
  - Order confirmation modal
  - Order summary with pricing details
  - Start new order functionality

- **Accessibility**
  - High contrast visual elements
  - Responsive design for all device sizes

## Technology Stack

- **Frontend**
  - React
  - Tailwind Css
  - Axios for API requests
  - Typescript

- **Backend**
  - Node.js
  - Express.js
  - MongoDB with Mongoose
  - JWT for authentication

## Installation and Setup

### Prerequisites
- Node.js (v14 or later)
- MongoDB
- npm or yarn

### Backend Setup
1. Clone the repository
   ```
   git clone https://github.com/hetchawda007/ecommerce-app.git
   cd ecommerce-app/backend
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env` file with the following variables
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/food-ordering-system
   JWT_SECRET=your_jwt_secret_key
   ```

4. Start the server
   ```
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory
   ```
   cd ../Client
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the client
   ```
   npm start
   ```

4. The application should now be running at `http://localhost:5173`


## License

[MIT](https://choosealicense.com/licenses/mit/)
