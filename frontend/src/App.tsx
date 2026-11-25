import { Link, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Catalog from './pages/Catalog.tsx';
import ProductDetail from './pages/ProductDetail.tsx';
import  Cart from './pages/Cart.tsx';
import Checkout from './pages/Checkout.tsx';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Catalog />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout/>}/>
        <Route
          path="*"
          element={
            <p>
              Page not found. <Link to="/">Back to the shop</Link>
            </p>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;