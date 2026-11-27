import type { TrackedOrder } from "../services/orders";
import { STATUS_INFO } from "../utils/orderStatus";
import StatusTracker from "./StatusTracker";
import { formatDate,formatPrice } from "../utils/format";

type Props ={
    order:TrackedOrder;
};

export default function OrderResult({order}:Props){
    const info = STATUS_INFO[order.status];
    const total = order.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const isCancelled = order.status === 'cancelled';

    return(
       <section className={isCancelled ? 'order-result is-cancelled' : 'order-result'}>
  <h2>Order {order.code}</h2>

  {isCancelled ? (
    <div className="cancelled-notice">
      <p className="status-label">{info.label}</p>
      <p>{info.description}</p>
    </div>
  ) : (
    <>
      <p className="status-label">{info.label}</p>
      <p>{info.description}</p>
      <StatusTracker status={order.status} />
    </>
  )}
            <p>Placed on {formatDate(order.createdAt)}</p>

            <ul className="order-items">
                {order.items.map((item, index) => (
                    <li key={`${item.productId}-${index}`}>
                        <span>
                            {item.name} × {item.quantity}
                            {item.customNote && <small> ({item.customNote})</small>}
                        </span>
                        <span>{formatPrice(item.unitPrice * item.quantity)}</span>
                    </li>
                ))}
            </ul>

            <p className="order-total">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
            </p>

            {!isCancelled&&<p>Payment: {order.paid ? 'Paid' : 'Not paid yet'}</p>}
        </section>
    )
}
