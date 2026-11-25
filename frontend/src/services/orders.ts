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