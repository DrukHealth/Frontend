
// import React from "react";
// import { Home, FileText, Settings, FileSearch, User } from "lucide-react";
// import "./css/dashboard.css";

// export default function Dashboard() {
//   return (
//     <div className="flex h-screen bg-blue-50">
//       {/* Sidebar */}
//       <aside className="w-64 bg-blue-400 text-white p-6 flex flex-col space-y-10">
//         {/* Logo Section */}
//         <div className="flex items-center space-x-2">
//           <div className="bg-white rounded-full p-2">
//             <img src="/logo.png" alt="Logo" className="w-8 h-8" />
//           </div>
//           <h2 className="font-semibold text-lg">Dashboard</h2>
//         </div>

//         {/* Navigation Links */}
//         <nav className="space-y-4 text-sm font-medium">
//           <div className="flex items-center space-x-2 cursor-pointer hover:text-gray-200">
//             <Home size={18} /> <span>Home</span>
//           </div>
//           <div className="flex items-center space-x-2 cursor-pointer hover:text-gray-200">
//             <FileText size={18} /> <span>Records</span>
//           </div>
//           <div className="flex items-center space-x-2 cursor-pointer hover:text-gray-200">
//             <Settings size={18} /> <span>Management</span>
//           </div>
//           <div className="flex items-center space-x-2 cursor-pointer hover:text-gray-200">
//             <FileSearch size={18} /> <span>Record Log</span>
//           </div>
//         </nav>
//       </aside>

//       {/* Main Content Area */}
//       <main className="flex-1 p-8">
//         {/* Header */}
//         <header className="flex justify-end items-center mb-8">
//           <div className="flex items-center space-x-2 text-gray-600">
//             <span className="font-medium">Admin</span>
//             <User size={20} />
//           </div>
//         </header>

//         {/* Placeholder for dashboard content */}
//         <section className="text-gray-500 text-center mt-20">
//           <p>Dashboard Content Goes Here</p>
//         </section>
//       </main>
//     </div>
//   );
// }

import React from "react";
import { Home, FileText, Settings, FileSearch, User } from "lucide-react";
import "./css/dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        {/* Logo Section */}
        <div className="logo-section">
          <div className="logo-circle">
            <img src="/logo.png" alt="Logo" className="logo-img" />
          </div>
          <h2 className="logo-text">Dashboard</h2>
        </div>

        {/* Navigation Links */}
        <nav className="nav-menu">
          <div className="nav-item">
            <Home size={18} /> <span>Home</span>
          </div>
          <div className="nav-item">
            <FileText size={18} /> <span>Records</span>
          </div>
          <div className="nav-item">
            <Settings size={18} /> <span>Management</span>
          </div>
          <div className="nav-item">
            <FileSearch size={18} /> <span>Record Log</span>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <div className="admin-profile">
            <span>Admin</span>
            <User size={20} />
          </div>
        </header>

        <section className="placeholder">
          <p>Dashboard Content Goes Here</p>
        </section>
      </main>
    </div>
  );
}
