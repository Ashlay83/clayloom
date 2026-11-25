import { Link, useLocation } from 'react-router-dom';
import { formatPrice } from '../utils/format';

type ConfirmationState = { code: string; total: number };

function isConfirmationState(value: unknown): value is ConfirmationState {
  return (
    typeof value === 'object' &&
    value !== null &&
    'code' in value &&
    typeof value.code === 'string' &&
    'total' in value &&
    typeof value.total === 'number'
  );
}

export default function OrderConfirmation() {
  const { state } = useLocation();

  if (!isConfirmationState(state)) {
    return (
      <section>
        <h1>No recent order</h1>
        <p>There's no order to show here.</p>
        <Link to="/">Back to the shop</Link>
      </section>
    );
  }

  return (
    <section className="confirmation">
      <h1>Thank you, your order is placed!</h1>
      <p>Your order code:</p>
      <p className="order-code">{state.code}</p>
      <p>Total: {formatPrice(state.total)}</p>
      <p>
        Save this code. You'll need it, along with the phone number you ordered with, to
        check your order's status.
      </p>
      <p>We'll contact you on WhatsApp to confirm your order and share payment details.</p>
      <Link to="/">Continue shopping</Link>
    </section>
  );
}