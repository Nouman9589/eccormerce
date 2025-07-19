# 🛍️ Mendeez - Full-Stack E-commerce Platform

A modern, feature-rich e-commerce platform built with React, TypeScript, Firebase, and Express.js. Mendeez provides a complete shopping experience with advanced features like wishlist management, product reviews, promo codes, and comprehensive admin analytics.

![E-commerce Platform](https://img.shields.io/badge/Platform-E--commerce-blue)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-Latest-blue)
![Firebase](https://img.shields.io/badge/Firebase-11.10.0-orange)
![PayPal](https://img.shields.io/badge/PayPal-Integration-blue)

## ✨ Features Overview

### 🔐 **Advanced Authentication System**
- **Firebase Authentication** with Google Sign-in and Email/Password
- **Role-based Access Control** (Admin/Customer)
- **User Profile Management** with avatar, address, and contact info
- **Protected Routes** with authentication guards
- **Session Persistence** across browser sessions

### 🛒 **Complete E-commerce Core**
- **Product Catalog** organized by categories (Shirts, Cloths, Accessories, Footwear)
- **Product Detail Pages** with image galleries, size selection, and descriptions
- **Shopping Cart** with quantity management and real-time updates
- **PayPal Payment Integration** with secure checkout process
- **Order Success/Failure Pages** with beautiful UI and next steps

### ❤️ **Smart Wishlist System**
- **Save Favorite Products** with heart icon interaction
- **Dedicated Wishlist Page** with grid layout and product management
- **Move Between Wishlist and Cart** with one-click actions
- **Wishlist Counter** in navigation with real-time updates
- **Persistent Storage** with localStorage integration

### ⭐ **Product Reviews & Ratings**
- **5-Star Rating System** with interactive star selection
- **Detailed Reviews** with titles, comments, and user verification
- **Review Helpfulness** voting (helpful/not helpful)
- **Review Sorting** (newest, oldest, highest rated, most helpful)
- **User Profile Integration** with reviewer names and badges
- **Admin Review Management** with delete functionality

### 💰 **Enhanced Cart Features**
- **Promo Code System** with validation and real-time discounts
  - `SAVE10`: 10% off your order
  - `SAVE20`: 20% off orders over $100
  - `WELCOME`: 15% off for new customers
  - `FREE5`: $5 off your order
- **Save for Later** functionality to move items between cart and saved items
- **Dynamic Price Calculations** with subtotal, discount, and total
- **Smart Empty States** showing saved items when cart is empty

### 🔍 **Advanced Search & Filter**
- **Debounced Search** with 300ms delay for optimal performance
- **Category Filtering** across all product categories
- **Price Range Filtering** with min/max price controls
- **Multiple Sorting Options**:
  - Price (Low to High / High to Low)
  - Name (A-Z)
  - Newest First
  - Rating (Highest First)
- **In-Stock Filtering** for inventory management
- **Filter Persistence** across page navigation

### 👤 **User Profile Management**
- **Comprehensive Profile Pages** with edit/view modes
- **Profile Statistics** showing orders, reviews, and membership duration
- **Address Management** with street, city, state, zip, and country
- **Avatar Support** with default gradient avatars
- **Account Settings** with profile updates

### 📊 **Admin Dashboard & Analytics**
- **Analytics Dashboard** with key performance metrics
- **Product Management** with add/edit/delete functionality
- **Customer Analytics** tracking views, conversions, and engagement
- **Product Performance** metrics with top products and activity feeds
- **Monthly Statistics** with growth tracking
- **Revenue Tracking** with conversion rate analysis

### 🎨 **Modern UI/UX Design**
- **Responsive Design** mobile-first approach with Tailwind CSS
- **Modern Component Library** using Lucide React icons
- **Interactive Animations** with hover states and transitions
- **Toast Notifications** for user feedback and success states
- **Loading States** with skeleton screens and spinners
- **Image Carousels** for product showcases and hero sections

## 🛠️ Technology Stack

### Frontend
- **React 18.3.1** - Modern React with hooks and context
- **TypeScript** - Type-safe development with strict typing
- **Vite** - Fast build tool and development server
- **React Router DOM 7.1.1** - Client-side routing with protected routes
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful SVG icons
- **React Icons** - Extended icon library

### Backend
- **Express.js** - Node.js web application framework
- **PayPal REST SDK** - Secure payment processing
- **CORS** - Cross-origin resource sharing middleware

### Database & Authentication
- **Firebase Authentication** - User authentication and management
- **Firestore** - NoSQL document database for products and user data
- **Local Storage** - Client-side persistence for cart, wishlist, and preferences

### Development Tools
- **ESLint** - Code linting and style enforcement
- **Autoprefixer** - CSS vendor prefixes
- **Nodemon** - Development server auto-restart

## 📁 Project Structure

```
mendeez-ecommerce/
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── Components/        # Reusable UI components
│   │   │   ├── AnalyticsDashboard.tsx
│   │   │   ├── AuthModal.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── ImageSlider.tsx
│   │   │   ├── Mendeez.tsx    # Header with cart/wishlist
│   │   │   ├── Navbar.tsx
│   │   │   ├── NotificationSystem.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ReviewSection.tsx
│   │   │   └── SearchAndFilter.tsx
│   │   ├── Context/          # React Context API
│   │   │   ├── AuthContext.tsx
│   │   │   ├── CartContext.tsx
│   │   │   ├── ProductContext.tsx
│   │   │   ├── ReviewsContext.tsx
│   │   │   └── WishlistContext.tsx
│   │   ├── Pages/            # Application pages
│   │   │   ├── Home.tsx
│   │   │   ├── ProductDetails.tsx
│   │   │   ├── CartPage.tsx
│   │   │   ├── Wishlist.tsx
│   │   │   ├── Profile.tsx
│   │   │   ├── AddProductForm.tsx
│   │   │   ├── DashboardItems.tsx
│   │   │   ├── SuccesPage.tsx
│   │   │   ├── FailedPage.tsx
│   │   │   ├── Accessories.tsx
│   │   │   ├── Cloths.tsx
│   │   │   ├── FootWear.tsx
│   │   │   └── Shirts.tsx
│   │   ├── firebase/         # Firebase configuration
│   │   └── Routes/           # Application routing
└── server/                   # Backend Express application
    ├── index.js             # PayPal payment processing
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Firebase Project** with Authentication and Firestore enabled
- **PayPal Developer Account** for payment processing

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mendeez-ecommerce.git
   cd mendeez-ecommerce
   ```

2. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd ../server
   npm install
   ```

4. **Configure Firebase**
   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Authentication and Firestore Database
   - Create `client/src/firebase/Firebase.tsx` with your Firebase config:
   ```typescript
   import { initializeApp } from 'firebase/app';
   import { getAuth } from 'firebase/auth';
   import { getFirestore } from 'firebase/firestore';
   
   const firebaseConfig = {
     // Your Firebase config
   };
   
   const app = initializeApp(firebaseConfig);
   export const auth = getAuth(app);
   export const db = getFirestore(app);
   ```

5. **Configure PayPal**
   - Update `server/index.js` with your PayPal credentials:
   ```javascript
   paypal.configure({
     mode: "sandbox", // or "live" for production
     client_id: "your-paypal-client-id",
     client_secret: "your-paypal-client-secret",
   });
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd server
   npm start
   # Server runs on http://localhost:8000
   ```

2. **Start the frontend development server**
   ```bash
   cd client
   npm run dev
   # Frontend runs on http://localhost:5174
   ```

3. **Access the application**
   - Frontend: `http://localhost:5174`
   - Backend API: `http://localhost:8000`

## 🎯 Key Features in Detail

### Authentication Flow
1. **User Registration/Login** via email/password or Google
2. **Role Assignment** (customer by default, admin via manual assignment)
3. **Profile Creation** with Firestore document
4. **Session Management** with Firebase Auth state persistence

### Shopping Experience
1. **Browse Products** by category with search and filters
2. **Product Details** with size selection and reviews
3. **Add to Cart** with quantity management
4. **Wishlist Management** for favorite items
5. **Promo Code Application** for discounts
6. **Secure Checkout** via PayPal integration

### Admin Capabilities
1. **Product Management** - Add, edit, delete products
2. **Analytics Dashboard** - View sales, customers, and performance
3. **Review Moderation** - Manage customer reviews
4. **User Management** - View customer profiles and activity

### Promo Codes Available
- **SAVE10** - 10% off any order
- **SAVE20** - 20% off orders over $100
- **WELCOME** - 15% off for new customers
- **FREE5** - $5 off any order

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop** (1024px and above)
- **Tablet** (768px - 1024px)
- **Mobile** (below 768px)

## 🔒 Security Features

- **Firebase Authentication** with secure token management
- **Role-based Access Control** for admin features
- **Input Validation** on forms and user inputs
- **Secure Payment Processing** via PayPal's secure API
- **Data Sanitization** for user-generated content

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your repository to Vercel
2. Set environment variables for Firebase configuration
3. Deploy with automatic builds on git push

### Backend (Railway/Heroku)
1. Create a new app on your preferred platform
2. Set environment variables for PayPal configuration
3. Deploy with automatic builds

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🛎️ Support

For support, email support@mendeez.com or create an issue in this repository.

## 🙏 Acknowledgments

- **Firebase** for authentication and database services
- **PayPal** for secure payment processing
- **Tailwind CSS** for beautiful styling
- **React Community** for excellent documentation and resources

---

**Built with ❤️ by the Mendeez Team**

*Experience modern e-commerce with Mendeez - where shopping meets innovation.*
