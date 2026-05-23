import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

function DashboardLayout({ children, name }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-black">

      {/* Sidebar always mounted, just collapses to icon strip */}
      <Sidebar isOpen={isSidebarOpen} />

      <div className="flex-1 bg-black">
        <Navbar
          name={name}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <main className="p-0">
          {children}
        </main>
      </div>

    </div>
  );
}

export default DashboardLayout;