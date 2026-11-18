import mongoose, { Schema, Types } from "mongoose";

export interface ICustomer {
  name: string;
  phone: string; // Changed from number to string per requirements
  address: string;
}

export interface IOrderItem {
  productId?: Types.ObjectId;
  name: string;
  unitPrice: number;
  quantity: number;
  customNote?: string | undefined;
}

export enum OrderStatus {
  New = 'new',
  Confirmed = 'confirmed',
  InProgress = 'in_progress',
  Ready = 'ready',
  Shipped = 'shipped',
  Delivered = 'delivered',
  Cancelled = 'cancelled',
}

export interface IOrder {
  code: string;
  customer: ICustomer;
  items: IOrderItem[];
  status: OrderStatus;
  paid: boolean;
  notes?: string | undefined;
  createdAt?: Date;
  updatedAt?: Date;
}

// Sub-schemas keep nested validation clean and disable unnecessary nested _id fields
const customerSchema = new Schema<ICustomer>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const orderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: false },
    name: { type: String, required: true },
    unitPrice: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    customNote: { type: String },
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    code: { type: String, required: true, unique: true, trim: true },
    customer: { type: customerSchema, required: true },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (val: IOrderItem[]) => val.length > 0,
        message: "Order must contain at least one item.",
      },
    },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.New,
    },
    paid: { type: Boolean, default: false },
    notes: { type: String },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, unknown>) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);


export const Order = mongoose.model<IOrder>("Order", orderSchema);