# NEVERBE ✨

A premium, high-performance Full-Stack E-Commerce web application built to deliver a seamless shopping experience for footwear and apparel. 

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white)

## 🚀 Features

- **Modern UI/UX**: Premium, clean design utilizing Tailwind CSS v4 and Ant Design, with smooth micro-interactions powered by Framer Motion.
- **Product Discovery**: Fast, typo-tolerant search and rich product filtering implemented with Algolia. 
- **E-Commerce Essentials**: Wishlist, dynamic shopping cart, product offers, curated combos, and new arrivals tracking.
- **Secure Authentication**: Seamless user registration and login flows managed reliably through Firebase Authentication.
- **Full Checkout Flow**: Integrated with PayHere and Koko for localized, secure payment processing.
- **Real-time Backend**: Firebase Cloud Firestore utilized for storing products, user data, and order history securely.
- **Order Management**: Comprehensive user dashboard to track order history, payment status, and delivery.
- **Responsive Design**: Flawless, app-like experience across desktop, tablet, and mobile devices.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router & Turbopack)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [Ant Design v6](https://ant.design/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Backend Infrastructure**: [Firebase](https://firebase.google.com/) (Auth, Firestore, Cloud Storage, App Hosting)
- **Search Engine**: [Algolia](https://www.algolia.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Forms & Client Logic**: React Hook Form, Axios, Date-fns

## ⚙️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v20 or newer recommended)
- npm, yarn, or pnpm
- A [Firebase Project](https://console.firebase.google.com/)
- An [Algolia Account](https://www.algolia.com/)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/HewageNKM/neverbe-web.git
   cd neverbe-web
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up Environment Variables
   Create a `.env.local` file in the root directory and add all the necessary environment variables required for your Firebase and Algolia environments. (You can refer to `apphosting.yaml` for the required variable keys).
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY="your_api_key"
   NEXT_PUBLIC_FIREBASE_APP_ID="your_app_id"
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your_auth_domain"
   NEXT_PUBLIC_FIREBASE_PROJECT_ID="your_project_id"
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your_storage_bucket"
   NEXT_PUBLIC_ALGOLIA_APP_ID="your_algolia_app_id"
   NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY="your_algolia_search_api_key"
   NEXT_PUBLIC_BASE_URL="http://localhost:3000"
   # Add your payment gateway keys and other required config
   ```

4. Run the development server
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## ☁️ Deployment

This project is fully configured for deployment using **Firebase App Hosting**. 
The included `apphosting.yaml` seamlessly handles the Node.js run configuration (min/max instances, memory, CPUs) and environment variable injection for production deployment on Google Cloud Run.

---
© 2025 NEVERBE, INC. All rights reserved.
