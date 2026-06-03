import { Outlet } from "react-router-dom";
import { Banner } from "../components/Banner";
import { NavBar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { CartSidebar } from "../components/CartSidebar";

export function AppLayout() {
  return (
    <>
     <Banner />
    <NavBar />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
      <CartSidebar />
    </>
  );
}
