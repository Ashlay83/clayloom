import {z} from 'zod';
import {  OrderStatus} from '../models/order.js';

export const createOrderSchema = z.object({
    customer: z.object({
        name:z.string().trim().min(2),
        phone:z.string().trim().regex(/^[6-9]\d{9}$/,'Enter a 10-digit Indian mobile number'),
        address:z.string().trim().min(5),
    }),

    items:z.array(z.object({
        productId:z.string().optional(),
        quantity:z.number().int().min(1).max(50),
        customNote:z.string().max(500).optional(),
    })).min(1),
    notes:z.string().max(1000).optional(),
});

export type CreateOrderInput= z.infer<typeof createOrderSchema>


export const updateStatusSchema = z.object({
  status: z.enum(OrderStatus), // Zod 3: z.nativeEnum(OrderStatus)
});

export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;