
import {  OrderStatus } from "../models/order.js";

export const allowed: Record<OrderStatus,OrderStatus[]> ={
    [OrderStatus.New]:[OrderStatus.Confirmed, OrderStatus.Cancelled],
    [OrderStatus.Confirmed]:[OrderStatus.InProgress,OrderStatus.Cancelled],
    [OrderStatus.InProgress]:[OrderStatus.Ready,OrderStatus.Cancelled],
    [OrderStatus.Ready]:[OrderStatus.Shipped],
    [OrderStatus.Shipped]:[OrderStatus.Delivered],
    [OrderStatus.Delivered]:[],
    [OrderStatus.Cancelled]:[]
}

export const canTransition = (from: OrderStatus, to: OrderStatus):boolean =>{
   return allowed[from].includes(to);
}