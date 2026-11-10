import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

export default function Header() {
  const { totalPorsi } = useCart();
  return (
    <header className="header">
      <div className="bar container">
        <Link to="/" className="logo" aria-label="SPPGIndonesia, ke beranda">
          <span className="logo-icon" aria-hidden="true">🍽</span>
          <span>SPPG<b>Indonesia</b></span>
        </Link>
        <nav aria-label="Navigasi utama" className="nav">
          <NavLink to="/menu" end>Katalog Menu</NavLink>
        </nav>
        <Link to="/checkout" className="cart-btn">
          Keranjang
          <span className="badge" aria-label={`${totalPorsi} porsi di keranjang`}>
            {totalPorsi}
          </span>
        </Link>
      </div>
    </header>
  );
}
