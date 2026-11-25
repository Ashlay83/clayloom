import { useState, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';

type FormState ={
    name:string;
    phone:string;
    address:string;
    notes:string;
};

export default function Checkout(){
    const {items, total}= useCart();
    const  [form, setForm]= useState<FormState>({
        name: ' ',
        phone:' ',
        address:' ',
        notes:' '
    });

    const handleChange =(e:ChangeEvent<HTMLInputElement|HTMLTextAreaElement>)=>{
        const {name, value}= e.target;
        setForm((prev)=>({...prev,[name]:value}));
    }

    const handleSubmit = (e:ChangeEvent<HTMLFormElement>)=>{
        e.preventDefault();
        console.log('form Values:',form);
    }

    if(items.length===0){
        return(
        <section>
            <h1>Checkout</h1>
            <p>Your cart is Empty</p>
            <Link to = "/">Browse the shop</Link>
        </section>);
    }
    return(
        <section className="checkout">

            <h1>Checkout</h1>
            <ul className="order-summary">
                {
                    items.map((item)=>(
                        <li key={item.productId}>
                            {item.name} x {item.quantity} - {formatPrice(item.price*item.quantity)}
                        </li>
                    ))
                }
            </ul>
            <p className='cart-total'>Total:{formatPrice(total)}</p>

            <form onSubmit={handleSubmit}className='checkout-form'>
                <label>
                    Name
                    <input name='name' value={form.name} onChange={handleChange}autoComplete='name'/>
                </label>
                <label>
                    Phone (Whatsapp)
                    <input name='phone' type='tel' value={form.phone} onChange={handleChange} autoComplete='tel'/>
                </label>
                <label>
                    Delivery address  
                    <textarea name='address'value={form.address}onChange={handleChange} rows={3} autoComplete='street-address'/>
                </label>
                <label>
                    Notes (optional)
                    <textarea name='notes' value={form.notes} onChange={handleChange} rows={2}/>
                </label>

                <button type='submit'> Place order</button>
            </form>
        </section>
    )
}