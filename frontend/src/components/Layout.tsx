import { Link, NavLink, Outlet } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Layout() {
  const { count } = useCart();

  return (
    <>
      <header className="site-header">
        <Link to="/" className="brand">
          Clayloom {/* replace with your sister's shop name */}
        </Link>
        <nav>
          <NavLink to="/">Shop</NavLink>
          <NavLink to="/cart">Cart ({count})</NavLink>
        </nav>
      </header>
      <main className="site-main">
        <Outlet />
      </main>
    </>
  );
}