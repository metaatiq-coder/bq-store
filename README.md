# Atiq Super Store - Lightweight & Fast

A lightweight, production-ready e-commerce store built with vanilla JavaScript and Firebase.

## ✨ Features

- **Fast & Lightweight**: Minimal code, no heavy dependencies
- **Firebase Integration**: Real-time database & authentication
- **Admin Dashboard**: Manage products with ease
- **Shopping Cart**: Persistent localStorage cart
- **Responsive Design**: Works on all devices
- **Simple & Clean**: Easy to understand and modify

## 🚀 Quick Start

### 1. Set Up Firebase
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project (or use existing)
3. Create Firestore database and enable Email/Password authentication
4. Copy your Firebase config to `src/js/config.js`

### 2. Create Test Users
In Firebase Console > Authentication > Users:
- **Customer**: customer@atiq.com / Customer123!
- **Admin**: admin@atiq.com / Admin123!

### 3. Add Admin Role
Run in Firebase Console:
```javascript
// Create admin custom claim
const admin = require('firebase-admin');
admin.auth().setCustomUserClaims('admin@atiq.com', {admin: true});
```

### 4. Add Sample Products
In admin panel or Firebase Console Firestore, add products to `products` collection:
```json
{
  "name": "Product Name",
  "price": 99.99,
  "image": "https://example.com/image.jpg",
  "description": "Product description"
}
```

### 5. Deploy
```bash
firebase deploy
```

## 📁 Project Structure

```
bq-store/
├── index.html          # Login page
├── products.html       # Product catalog
├── cart.html          # Shopping cart
├── admin.html         # Admin dashboard
├── src/
│   ├── js/
│   │   ├── config.js      # Firebase config
│   │   ├── utils.js       # Shared utilities
│   │   ├── products.js    # Products logic
│   │   ├── cart.js        # Cart logic
│   │   └── dashboard.js   # Admin logic
│   └── css/
│       └── style.css      # Custom styles
├── firebase.json      # Firebase config
└── package.json       # Project metadata
```

## 🔐 Login Credentials

**Test User:**
- Email: customer@atiq.com
- Password: Customer123!

**Admin:**
- Email: admin@atiq.com
- Password: Admin123!

## 🎯 Key Files

- **Login**: `index.html` - Customer & admin login
- **Products**: `products.html` - Browse & filter products
- **Cart**: `cart.html` - View & checkout
- **Admin**: `admin.html` - Manage products
- **Config**: `src/js/config.js` - Firebase credentials

## ⚡ Performance

- **No build step required** - Direct browser execution
- **Minimal CSS** - 36 lines of custom CSS
- **Pure JavaScript** - No frameworks or heavy libraries
- **Instant loading** - All via CDN

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, Tailwind (CDN), JavaScript
- **Backend**: Firebase Firestore
- **Auth**: Firebase Authentication
- **Hosting**: Firebase Hosting

## 📝 Notes

- Tailwind CSS loaded from CDN (no build needed)
- Firebase SDK v9.22.2 via CDN
- All localStorage for cart persistence
- Admin verified via custom claims

## 🚨 Important

1. Update `src/js/config.js` with your Firebase credentials
2. Create test users with proper admin claims
3. Add sample products in admin panel
4. Deploy with `firebase deploy`

Done! Your store is live and ready. 🎉
