// Layout.jsx
import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import SideBar from './SideBar';

function Layout() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const sidebarWidth = isOpen ? 250 : 60;



  // 🔸 Auto close sidebar if screen width < 1300px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1300) {
        setIsOpen(false);
      } 
    };

    // Run on mount
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  return (
    <div className="flex min-h-screen">
      {/* Fixed Sidebar */}
      <div className="fixed top-0 left-0 h-screen z-50 transition-all duration-500 ease-in-out" style={{ width: sidebarWidth }}>
        <SideBar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-grow transition-all duration-500 ease-in-out" style={{ marginLeft: sidebarWidth }}>
        <div className="fixed top-0 right-0 z-40 transition-all duration-500 ease-in-out" style={{ left: sidebarWidth }}>
          <NavBar />
        </div>

        <div className="mt-[60px] overflow-auto h-[calc(100vh-60px)]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;
