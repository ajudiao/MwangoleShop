import { Outlet } from "react-router-dom";
import { Banner } from "../components/Banner";
import { NavBar } from "../components/Navbar";

export function AppLayout() {
  return (
    <>
     <Banner />
    <NavBar />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <p>Footer</p>
      <p>CartSidebar</p>
    </>
  );
}
