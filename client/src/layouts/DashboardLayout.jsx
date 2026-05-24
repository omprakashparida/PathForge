import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

function DashboardLayout({ children, name }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-black relative">


      {/* Mobile Overlay */}

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}


      {/* Sidebar */}
    

      {/* Mobile: slides in as drawer */}
      <div className={`
        fixed top-0 left-0 h-full z-30 lg:hidden
        transform transition-transform duration-300
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar isOpen={true} onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Desktop: always visible, collapses to icon strip */}
      <div className="hidden lg:block">
        <Sidebar isOpen={isSidebarOpen} />
      </div>

      {/* ========================== */}
      {/* Main Content */}
      {/* ========================== */}
      <div className="flex-1 bg-black min-w-0">
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