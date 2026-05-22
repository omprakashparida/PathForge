import { useState } from 'react';

import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

function DashboardLayout({
  children,
  name,
}) {

  const [isSidebarOpen, setIsSidebarOpen] =
    useState(true);

  return (

    <div className="flex min-h-screen bg-gray-100">

      <Sidebar isOpen={isSidebarOpen} />

      <div className="flex-1">

        <Navbar
          name={name}
          toggleSidebar={() =>
            setIsSidebarOpen(!isSidebarOpen)
          }
        />

        <main className="p-8">
          {children}
        </main>

      </div>

    </div>
  );
}

export default DashboardLayout;