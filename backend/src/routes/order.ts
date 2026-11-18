import { Router } from 'express';
import { Order, type IOrder , OrderStatus} from '../models/order.js';
import { Product } from '../models/product.js';
import { requireAuth } from '../middlewares/auth.js';
import { createOrderSchema,updateStatusSchema} from '../schemas/order.js';
import { canTransition } from '../utils/orderStatus.js';
import { generateOrderCode } from '../utils/orderCode.js';


const router = Router();

// Retries with a new code if two orders ever get the same one (error code 11000 = duplicate key)
async function createOrder(data: Pick<IOrder, 'customer' | 'items' | 'notes'>) {
  for (let attempt = 1; ; attempt++) {
    try {
      return await Order.create({ ...data, code: generateOrderCode() });
    } catch (error) {
      const isDuplicate = (error as { code?: number }).code === 11000;
      if (!isDuplicate || attempt >= 3) throw error;
    }
  }
}

// PUBLIC: customer places an order
router.post('/', async (req, res) => {
  const input = createOrderSchema.parse(req.body);

  const ids: string[] = [];
  for (const item of input.items) {
    if (!item.productId) {
      res.status(400).json({ error: 'Custom items are not supported yet' });
      return;
    }
    ids.push(item.productId);
  }

  const products = await Product.find({ _id: { $in: ids }, inStock: true });
  const byId = new Map(products.map((p) => [p.id, p]));

  const items = [];
  for (const item of input.items) {
    const product = byId.get(item.productId!);
    if (!product) {
      res.status(400).json({ error: `Product ${item.productId} is not available` });
      return;
    }
    items.push({
      productId: product._id,
      name: product.name,         // snapshot from the database,
      unitPrice: product.price,   // never trust a price from the client
      quantity: item.quantity,
      customNote: item.customNote,
    });
  }

  const order = await createOrder({ customer: input.customer, items, notes: input.notes });
  const total = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  res.status(201).json({ code: order.code, total });
});

// ADMIN: list orders, optional ?status=new, newest first
router.get('/', requireAuth, async (req, res) => {
  const { status } = req.query;
  const filter: { status?: OrderStatus } = {};

  if (typeof status === 'string') {
    if (!Object.values(OrderStatus).includes(status as OrderStatus)) {
      res.status(400).json({ error: 'Invalid status filter' });
      return;
    }
    filter.status = status as OrderStatus;
  }

  const orders = await Order.find(filter).sort({ createdAt: -1 });
  res.json(orders);
});

// PUBLIC: customer tracks an order with code + phone
router.get('/track/:code', async (req, res) => {
  const { phone } = req.query;
  const order =
    typeof phone === 'string'
      ? await Order.findOne({
          code: req.params.code.toUpperCase(),
          'customer.phone': phone.trim(),
        })
      : null;

  if (!order) {
    // same message for a wrong code and a wrong phone
    res.status(404).json({ error: 'Order not found' });
    return;
  }

  res.json({
    code: order.code,
    status: order.status,
    paid: order.paid,
    items: order.items,
    createdAt: (order as any).createdAt,
  });
});

// ADMIN: change status, following the allowed transitions
router.patch('/:id/status', requireAuth, async (req, res) => {
  const { status: newStatus } = updateStatusSchema.parse(req.body);

  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }

  if (!canTransition(order.status, newStatus)) {
    res.status(400).json({ error: `Cannot move order from ${order.status} to ${newStatus}` });
    return;
  }

  order.status = newStatus;
  await order.save();
  res.json(order);
});

export { router };