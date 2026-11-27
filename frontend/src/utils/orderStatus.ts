import type {OrderStatus} from '../services/orders';

export const STATUS_INFO: Record<OrderStatus,{label:string;description:string}> ={
  new:         { label: 'Order received', description: "We've got your order and will confirm it soon." },
  confirmed:   { label: 'Confirmed',      description: 'Your order is confirmed and in the queue.' },
  in_progress: { label: 'Being made',     description: 'Your items are being handmade right now.' },
  ready:       { label: 'Ready',          description: 'Your order is finished and ready to send.' },
  shipped:     { label: 'Shipped',        description: 'Your order is on its way to you.' },
  delivered:   { label: 'Delivered',      description: 'Your order has arrived. Enjoy!' },
  cancelled:   { label: 'Cancelled',      description: 'This order was cancelled. Message us on Instagram if you have any questions.' }
};

export const PROGRESS_STEPS: Exclude<OrderStatus, 'cancelled'>[] = [
  'new',
  'confirmed',
  'in_progress',
  'ready',
  'shipped',
  'delivered',
];