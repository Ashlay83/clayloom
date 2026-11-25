import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';
import { createOrder } from '../services/orders';
import {useState, type ChangeEvent, type FormEvent} from 'react';



export default function Cart() {
  const { items, total, setQuantity, removeItem, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <section>
        <h1>Your cart</h1>
        <p>Your cart is empty.</p>
        <Link to="/">Browse the shop</Link>
      </section>
    );
  }

  return (
    <section className="cart">
      <h1>Your cart</h1>
      <ul className="cart-list">
        {items.map((item) => (
          <li key={item.productId} className="cart-item">
            <div>
              <Link to={`/products/${item.productId}`}>{item.name}</Link>
              <div>{formatPrice(item.price)} each</div>
            </div>
            <input
              type="number"
              min={1}
              max={50}
              value={item.quantity}
              aria-label={`Quantity for ${item.name}`}
              onChange={(e) => {
                const value = e.target.valueAsNumber;
                if (!Number.isNaN(value)) setQuantity(item.productId, value);
              }}
            />
            <span>{formatPrice(item.price * item.quantity)}</span>
            <button onClick={() => removeItem(item.productId)}>Remove</button>
          </li>
        ))}
      </ul>

      <p className="cart-total">Total: {formatPrice(total)}</p>
      <button onClick={clearCart}>Clear cart</button>
      <button disabled title="Coming in the next task">
        Checkout
      </button>
      <button
  onClick={async () => {
    const result = await createOrder({
      customer: { name: 'Test Buyer', phone: '9876543210', address: '12 Test Street, Kochi' },
      items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
    });
    console.log(result);
  }}
>
  Test order
</button>
    </section>
  );
}