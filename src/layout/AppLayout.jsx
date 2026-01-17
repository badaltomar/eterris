import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";

export default function AppLayout() {
  return (
    <>
      <div className="app-root d-flex">
        <Sidebar />
        <div className="page-content flex-grow-1 ">
          <Outlet />
        </div>
      </div>
      <footer className="bg-secondary text-center p-3">
        <p className="fw-bold">&copy; Eterris CRM pvt ltd 2026</p>
      </footer>
    </>
  );
}
