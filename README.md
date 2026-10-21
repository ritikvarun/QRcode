# Dynamic QR Code Creator & Management Studio

A production-ready **MERN Stack** dynamic QR code management platform designed specifically for physical media, textbooks, educational publications, and marketing campaigns.

Printed QR codes in books and brochures point to a **permanent dynamic short URL** (`/q/:qrId`). When readers scan the code, the backend looks up its current destination URL in MongoDB and redirects them seamlessly. **You can change the destination website at any time without reprinting physical copies.**

---

## 📸 Interface Preview (Matching Your Design)

The system includes the card design reference:
* **Left Section:** Crisp QR Code image preview with a direct green **Download** button.
* **Middle Section:** Big **Total scans** counter, **Statistics** link, and interactive **Status** toggle switch (`Active` / `Inactive`).
* **Right Section:** Type (`Website`), Bold Title (e.g. `Educazone/class9`), permanent short URL (`/q/:qrId`) with 1-click copy, curved branch arrow (`↳ destination`), date created, folder tag, and quick action icons (🎨 Preview, ✏️ Edit Destination, 📋 Copy, 🗑️ Delete).

---

## 🛠️ Technology Stack

* **Frontend:** React 19 + Vite + JavaScript (JSX)
* **Styling:** Tailwind CSS (Modern dark mode SaaS UI)
* **Backend:** Node.js + Express.js (ES Modules)
* **Database:** MongoDB Atlas + Mongoose
* **Authentication:** JWT + bcryptjs (Secure admin session)
* **QR Generation:** `qrcode` npm package
* **API Calls:** Axios with request & response interceptors
* **Icons:** Lucide React

---

## 📁 Project Structure

```text
QR code/
├── client/                     # React Frontend (Vite + Tailwind CSS)
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── QRCard.jsx      # Dynamic QR card matching reference design
│   │   │   ├── CreateQRModal.jsx # New Dynamic QR generator modal
│   │   │   ├── EditQRModal.jsx   # Target URL editor (leaves QR ID untouched)
│   │   │   ├── QRDetailsModal.jsx# Preview, stats, and print view
│   │   │   ├── DeleteConfirmModal.jsx
│   │   │   ├── Sidebar.jsx     # Responsive SaaS sidebar navigation
│   │   │   ├── Navbar.jsx      # Top header with quick action triggers
│   │   │   └── Toast.jsx       # Auto-dismissing feedback notifications
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Global JWT session state & persistence
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx   # Admin authentication with demo credentials helper
│   │   │   ├── DashboardPage.jsx # Metrics overview & recent QRs
│   │   │   ├── QRListPage.jsx  # Search, status & folder filters, batch operations
│   │   │   └── ProfilePage.jsx # Infrastructure & admin profile
│   │   ├── services/
│   │   │   └── api.js          # Axios client with interceptors
│   │   ├── App.jsx             # Main routing and modal orchestration
│   │   ├── main.jsx
│   │   └── index.css           # Tailwind CSS imports & theme
│   ├── .env.example
│   ├── vercel.json             # Vercel SPA routing configuration
│   └── vite.config.js
│
├── server/                     # Node.js + Express Backend
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js           # Mongoose MongoDB connection
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── qr.controller.js
│   │   │   └── redirect.controller.js # Public dynamic 302 redirection & scan counter
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js     # Bearer JWT verification
│   │   │   └── error.middleware.js    # Centralized error handling
│   │   ├── models/
│   │   │   ├── QR.js           # Mongoose schema for dynamic QR codes
│   │   │   └── User.js         # Mongoose schema for Admin
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── health.routes.js
│   │   │   ├── qr.routes.js
│   │   │   └── redirect.routes.js     # GET /q/:qrId
│   │   ├── services/
│   │   │   └── store.service.js       # Dual-mode Mongoose & memory storage layer
│   │   ├── utils/
│   │   │   ├── qrHelper.js            # Short ID, URL normalizer & QR renderer
│   │   │   └── token.js               # JWT sign and verify
│   │   ├── app.js              # Express app setup, CORS, body parsers
│   │   └── server.js           # HTTP listener & Admin auto-seeding
│   ├── .env.example
│   └── render.yaml             # Render deployment blueprint
│
├── package.json                # Monorepo root scripts
└── .gitignore
```

---

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies
Run from the root directory:
```bash
npm run install:all
```

### 2. Configure Environment Variables

**Backend (`server/.env`):**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/dynamic_qr_db?retryWrites=true&w=majority
JWT_SECRET=super_secret_jwt_dynamic_qr_key_change_me_in_production_2026
JWT_EXPIRES_IN=7d
BASE_URL=http://localhost:5000
CLIENT_URL=http://localhost:5173
ADMIN_INITIAL_EMAIL=admin@dynamicqr.local
ADMIN_INITIAL_PASSWORD=Admin@123456
```

**Frontend (`client/.env`):**
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SERVER_BASE_URL=http://localhost:5000
```

### 3. Run Both Servers

Open two terminals (or run root commands):

* **Terminal 1 (Backend):**
  ```bash
  npm run server
  ```
  *(Runs on `http://localhost:5000` with nodemon)*

* **Terminal 2 (Frontend):**
  ```bash
  npm run client
  ```
  *(Runs on `http://localhost:5173` with Vite HMR)*

### 4. Default Admin Login
* **URL:** `http://localhost:5173`
* **Email:** `admin@dynamicqr.local`
* **Password:** `Admin@123456`
*(Or click the "Auto-Fill Default Admin Credentials" button on the login screen)*

---

## ⚡ How Dynamic Redirection Works

1. **Admin creates a QR code:**
   - Admin inputs Title: `Educazone/class9` and Destination: `https://www.educazonebooks.com/class-9`.
   - The backend generates a permanent short ID (e.g. `P3MghF`).
   - The generated QR image permanently encodes `http://yourdomain.com/q/P3MghF`.
2. **Printing:**
   - The QR code is downloaded as a high-resolution PNG and printed in textbooks.
3. **Scanning:**
   - A student scans the physical QR code with their mobile phone.
   - The phone requests `http://yourdomain.com/q/P3MghF`.
   - The backend increments `scanCount` by 1 and returns an **HTTP 302 Redirect** to `https://www.educazonebooks.com/class-9`.
4. **Updating URL 2 years later:**
   - Admin logs into the dashboard and updates the destination URL to `https://www.educazonebooks.com/class-9/2028-syllabus`.
   - The QR ID and printed QR image remain **100% identical**.
   - All physical books immediately redirect to the new 2028 syllabus page!

---

## ☁️ Production Deployment

### Backend Deployment (Render)
1. Push your repository to GitHub.
2. In [Render Dashboard](https://dashboard.render.com/), click **New > Web Service** and select your repository.
3. Set **Root Directory** to `server`.
4. Set **Build Command** to `npm install`.
5. Set **Start Command** to `node src/server.js`.
6. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A long random secret string
   - `BASE_URL`: `https://your-backend-domain.onrender.com` (or your custom QR domain)
   - `CLIENT_URL`: `https://your-frontend.vercel.app`
   - `ADMIN_INITIAL_EMAIL`: `admin@yourdomain.com`
   - `ADMIN_INITIAL_PASSWORD`: A secure password

### Frontend Deployment (Vercel)
1. In [Vercel Dashboard](https://vercel.com/dashboard), click **Add New > Project** and select your repository.
2. Set **Root Directory** to `client`.
3. Set **Framework Preset** to `Vite`.
4. Add Environment Variables:
   - `VITE_API_BASE_URL`: `https://your-backend-domain.onrender.com/api`
   - `VITE_SERVER_BASE_URL`: `https://your-backend-domain.onrender.com`
5. Click **Deploy**.

---

## 🌐 Custom Domain Strategy for Printed Media Longevity

> [!IMPORTANT]
> **Why a Custom Domain is Critical for Books:**
> Free hosting domains (like `onrender.com` or `vercel.app`) can change or deprecate over time. When printing QR codes in physical books that stay on shelves for 5 to 10 years, you should attach a **custom branded short domain** (e.g. `qr.educazonebooks.com` or `qrto.org`).

### How to configure:
1. In your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.), add a CNAME record:
   - **Type:** `CNAME`
   - **Host / Name:** `qr` (e.g. `qr.yourdomain.com`)
   - **Target / Value:** `your-backend.onrender.com`
2. In Render, add `qr.yourdomain.com` as a Custom Domain.
3. Set `BASE_URL=https://qr.yourdomain.com` in your backend environment variables.
4. All future dynamic QR codes will now encode `https://qr.yourdomain.com/q/XYZ`, ensuring your printed physical books remain functional for decades!
