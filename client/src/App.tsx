import { Route, Routes } from "react-router-dom";
import { Login } from "./pages/Login";
import { AppLayout } from "./pages/AppLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Checkout } from "./pages/Checkout";
import { Home } from "./pages/Home";
import { Products } from "./pages/Products";
import { ProductPage } from "./pages/ProductPage";
import { MyOrders } from "./pages/MyOrders";
import { OrderTracking } from "./pages/OrderTracking";
import { SearchResult } from "./pages/SearchResult";
import { FlashDeals } from "./pages/FlashDeals";
import { Addresses } from "./pages/Addresses";

export function App() {
  return (
    <>
      <Routes>
        {/* Auth pages - Sem navbar / Footer */}
        <Route path="/login" element={<Login />} />

        {/* Main page - Com Navbar / Footer */}
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductPage />} />
          <Route path="search" element={<SearchResult />} />
          <Route path="deals" element={<FlashDeals />} />

          <Route element={<ProtectedRoute />}>
            <Route path="checkout" element={<Checkout />} />
            <Route path="orders" element={<MyOrders />} />
            <Route path="orders/:id" element={<OrderTracking  />} />
            <Route path="addresses" element={<Addresses />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}
