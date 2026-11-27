export type OrderInput ={
    customer: {name:string ; phone: string; address:string};
    items:{productId:string; quantity:number;}[];
    notes?: string |undefined;
};

export type OrderCreated={
    code: string;
    total: number;
};

export class ApiError extends Error{
    details:string[];
    constructor(message:string, details:string[]=[]){
        super(message);
        this.name= 'ApiError';
        this.details= details;
    }
}

export const createOrder = async(input:OrderInput):Promise<OrderCreated>=>{
    const response = await fetch('/api/orders',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(input),
    });

    if(!response.ok){
        const body = (await response.json().catch(()=>null))as
            |{error?:string;details?:string[]}
            |null;
        throw new ApiError(body?.error??`Request failed(${response.status})`,body?.details??[]);
    }
    return response.json() as Promise<OrderCreated>;
};

export type OrderStatus =
|'new' |'confirmed'| 'in_progress'|'ready'|'shipped'|'delivered'|'cancelled';

export type TrackedOrderItem = {
    productId: string;
    name:string;
    unitPrice:number;
    quantity:number;
    customNote?:string;
};

export type TrackedOrder={
    code:string;
    status:OrderStatus;
    paid:boolean;
    items:TrackedOrderItem[];
    createdAt:string;
};

export class OrderNotFoundError extends Error{
    constructor(){
        super('Order not Found');
        this.name= 'OrderNotFoundError';
    }
}

export const trackOrder = async (code: string, phone: string): Promise<TrackedOrder> => {
  const params = new URLSearchParams({ phone });
  const response = await fetch(`/api/orders/track/${encodeURIComponent(code)}?${params}`);

  if (response.status === 404) {
    throw new OrderNotFoundError();
  }
  if (!response.ok) {
    throw new ApiError(`Request failed (${response.status})`);
  }
  return response.json() as Promise<TrackedOrder>;
};