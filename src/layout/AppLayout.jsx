import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import Sidebar from "../components/common/Sidebar";
import "../components/common/App.css";
import Footer from "../components/common/Footer.jsx";
import ScrollToTop from "../components/common/ScrollToTop";

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeSidebar = () => setMobileOpen(false);

  return (
    <>
      <ScrollToTop />
      <div className={`app-root ${mobileOpen ? "blur-active" : ""}`}>
        {/* Mobile Header */}
        <div className="mobile-topbar">
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={22} />
          </button>
          <span className="mobile-brand">Eterris</span>
        </div>

        {/* Sidebar */}
        <div
          className={`sidebar-overlay ${mobileOpen ? "active" : ""}`}
          onClick={closeSidebar}
        />

        <div className={`sidebar-container ${mobileOpen ? "open" : ""}`}>
          <Sidebar closeMobile={closeSidebar} />
        </div>

        {/* Page Content */}
        <div className="page-content" style={{ minWidth: 0 }}>
          <Outlet />
        </div>
      </div>

      <Footer />
    </>
  );
}
