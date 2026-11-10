import { Outlet } from "react-router-dom";
import Header from "../components/Header.jsx";
import { CartProvider } from "../context/CartContext.jsx";
import "./store.css";

export default function StoreLayout() {
  return (
    <CartProvider>
      <div className="store-app">
        <a className="skip" href="#konten">Lewati ke konten utama</a>
        <Header />
        <main id="konten" tabIndex={-1} className="container">
          <Outlet />
        </main>
        <footer className="footer">
          <p>© 2026 SPPGIndonesia · Program Makan Bergizi Gratis</p>
        </footer>
      </div>
    </CartProvider>
  );
}
