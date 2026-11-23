import type {Product} from '../types';

export type CartItem = {
    productId:string;
    name:string;
    price:number;
    quantity:number;
};

export type CartAction =
    |{type:'add';product:Product;quantity?:number|undefined}
    |{type:'remove';productId:string}
    |{type:'setQuantity';productId:string;quantity:number}
    |{type:'clear'};

const MAX_QUANTITY = 50;

const clamp =(n:number):number =>
    Number.isFinite(n) ? Math.min(MAX_QUANTITY, Math.max(1,Math.floor(n))):1;

export function cartReducer(state: CartItem[],action : CartAction):CartItem[]{
    switch(action.type){
        case 'add':{
            const quantity= clamp(action.quantity??1);
            const exists= state.some((item)=>item.productId===action.product.id);

            if(exists){
                return state.map((item)=>
                item.productId===action.product.id
                ?{...item,quantity:clamp(item.quantity+quantity)}
                :item);
            }

            return[
                ...state,
                {
                    productId:action.product.id,
                    name:action.product.name,
                    price:action.product.price,
                    quantity,
                },
            ];
        }
        case'remove':
            return state.filter((item)=>item.productId !==action.productId);
        case'setQuantity':
            return state.map((item)=>
                item.productId==action.productId
            ?{...item, quantity:clamp(action.quantity)}
            :item
        );

        case'clear':
            return [];

        default : {
            const unreachable : never = action;
                return unreachable;
        }
    }
}