## Zhiwa-CTG Frontend (Web Application)

The Zhiwa-CTG Frontend is a React-based web application that allows healthcare workers to upload CTG (Cardiotocography) graph images and receive AI-based classification results (Normal, Suspicious, Pathological). The system supports both user-facing CTG upload/scanning and an admin dashboard for managing records and users.

### Purpose

Interpreting CTG graphs manually is challenging, time-consuming, and prone to human error—especially in hospitals where nurses and mid-level health workers must make quick decisions without direct doctor support.

This frontend web application provides:

- A simple interface for uploading CTG graph images

- Instant AI classification of fetal health status (via backend API)

- Admin portal for record management and monitoring

- Super Admin controls for managing admin accounts

Goal: Improve speed, accuracy, and reliability of fetal health assessment in clinical environments.

### User Features

- Upload CTG graph images

- Send image to AI model for classification

- Receive results: Normal / Suspicious / Pathological

- View diagnostic summary and details

- Clean, simple UI designed for non-technical users

### Admin Features
#### Dashboard

- Overview of all CTG submissions

- Total records for day, week, month, and year

- Recent activity list for quick monitoring

#### Records

- View all CTG submissions

- Access classification results

- Check date/time of uploads

- Filter and search records

#### User Management (Super Admin Only)

- Add new admin users

- Edit admin details

- Delete admin accounts

#### Admin Permissions

- Super Admin: Full CRUD access + manage admins

- Admin: View-only access (dashboard + records, no editing)

#### Security

- Secure admin login

- Password hashing

- Password reset support

### Architecture & Tech Stack

- Frontend: React with Vite
- Styling: CSS / TailwindCSS
- Routing: React Router
- State Management: React Hooks
- API Calls: Axios
- Deployment: Vercel

### API Integration
The frontend communicates with a backend API for:
- User authentication and authorization
- CTG image upload and processing
- Retrieving classification results
- Admin dashboard data
  
### Project Structure

DRUKHEALTHFRONT

│

├── public/

│   ├── image1.png

│   └── image2.png
│
├── src/

│   ├── assets/

│   │   ├── react.svg

│   │   └── image1.svg

│   ├── pages/

│   │   ├── adminpages/

│   │   │   ├── LoginPage.jsx

│   │   │   ├── Dashboard.jsx

│   │   │   ├── DashboardHome.jsx

│   │   │   ├── Records.jsx

│   │   │   ├── Management.jsx

│   │   │   ├── AdminProfile.jsx

│   │   │   ├── ChangePassword.jsx

│   │   │   ├── ForgotPassword.jsx

│   │   │   ├── PasswordVerify.jsx

│   │   │   └── css/

│   │   ├── userpages/

│   │   │   ├── Landing.jsx

│   │   │   ├── Home.jsx

│   │   │   ├── CTGScan.jsx

│   │   │   ├── Diagnosis.jsx

│   │   │   ├── Result.jsx

│   │   │   └── css/

│   ├── api.js

│   ├── main.jsx

│   └── App.jsx
│
├── package.json

├── vite.config.js

├── tailwind.config.js

└── README.md

### Installation & Setup
#### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

#### Installation Steps

1. Clone the repository

    - git clone https://github.com/DrukHealth/Frontend.git 
    - cd Frontend


2. Install dependencies

    - npm install


3. Run development server

   - npm run dev

#### Available Scripts
- npm run dev - Start development server

- npm run build - Build for production

- npm run preview - Preview production build

### Deployment (Vercel)

Platform: Vercel (React + Vite frontend)

Deployment Steps:

1. Connect GitHub repository to Vercel (auto-detects Vite)

2. Configure environment variables:

   - VITE_API_URL="https://your-backend.onrender.com"

3. Deploy – Vercel automatically builds and hosts the frontend

### Zero-Disruption Strategy:

- Use environment variables for API URLs

- Instant rollbacks supported if needed

#### Live Site: 
https://drukhealthfrontend.vercel.app/ 

### Development
#### API Integration
The frontend expects a backend API with endpoints for:

- Authentication (/api/auth/login, /api/auth/forgot-password, etc.)

- CTG processing (/api/ctg/upload, /api/ctg/results)

- Admin data (/api/admin/dashboard, /api/admin/records)

  