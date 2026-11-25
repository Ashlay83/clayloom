import { 
    useEffect,
    useContext,
    useMemo,
    createContext,
    useReducer,
    type ReactNode,
 } from "react";

import { cartReducer, type CartItem } from "../cart/cartReducer";
import type { Product } from "../types";

const STORAGE_KEY= 'clayloom-cart';

function loadCart():CartItem[]{
    try{
        const raw = localStorage.getItem(STORAGE_KEY);
        if(!raw)return [];
        const parsed:unknown= JSON.parse(raw);
        return Array.isArray(parsed) ? (parsed as CartItem[]):[];

    }
    catch{
        return[];
    }
}

type CartContextValue= {
    items: CartItem[];
    count:number;
    total:number;
    addItem:(product:Product,quantity?:number)=>void;
    removeItem:(productId:string)=>void;
    setQuantity:(productId:string,quantity:number)=>void;
    clearCart:()=>void;
};

const CartContext= createContext<CartContextValue | null>(null);

export function CartProvider({children}:{children:ReactNode}){
    const[items, dispatch]=useReducer(cartReducer,[],loadCart);

    useEffect(()=>{
        try{
            localStorage.setItem(STORAGE_KEY,JSON.stringify(items));
        }
        catch{

        }
    },[items]);

    const value = useMemo<CartContextValue>(
        ()=>({
            items,
            count:items.reduce((sum,item)=>sum+item.quantity,0),
            total:items.reduce((sum,item)=>sum+item.price*item.quantity,0),
            addItem:(product,quantity)=>dispatch({type:'add',product,quantity}),
            removeItem:(productId)=>dispatch({type:'remove',productId}),
            setQuantity:(productId,quantity)=> dispatch({type:'setQuantity',productId,quantity}),
            clearCart:()=>dispatch({type:'clear'}),
        }),
        [items],
    );
    return<CartContext.Provider value={value}>{children}</CartContext.Provider>;
    
}

export function useCart():CartContextValue{
    const context = useContext(CartContext);
    
    if(!context){
        throw new Error('useCart must be used inside <CartProvider>');

    }
    return context;
}
