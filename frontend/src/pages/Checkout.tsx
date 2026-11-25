import { useState, type ChangeEvent } from 'react';
import { Link ,useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';
import { validateCheckout , type FieldErrors} from '../schemas/checkout';
import {useMutation} from '@tanstack/react-query';
import {createOrder,ApiError} from '../services/orders';


type FormState ={
    name:string;
    phone:string;
    address:string;
    notes:string;
};

export default function Checkout(){
    const {items, total,clearCart}= useCart();
    const navigate = useNavigate();
    const  [form, setForm]= useState<FormState>({
        name: ' ',
        phone:' ',
        address:' ',
        notes:' '
    });
    const [errors, setErrors] = useState<FieldErrors>({});
    const mutation = useMutation({
        mutationFn: createOrder,
        onSuccess: (data) => {
            clearCart();
            navigate('/order-confirmation', { state: { code: data.code, total: data.total } });
        },
    });

    const handleChange =(e:ChangeEvent<HTMLInputElement|HTMLTextAreaElement>)=>{
        const {name, value}= e.target;
        setForm((prev)=>({...prev,[name]:value}));
    }

    const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();

        const result = validateCheckout(form);
            if (!result.ok) {
                setErrors(result.errors);
                return;
                }

        setErrors({});
        mutation.mutate({
            customer:{
                name:result.data.name,
                phone:result.data.phone,
                address:result.data.address,
            },
            items:items.map((item)=>({productId:item.productId,quantity:item.quantity})),
            notes:result.data.notes||undefined,
        });
        
};



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
                    <input name='name' value={form.name} onChange={handleChange}autoComplete='name' aria-invalid={Boolean(errors.name)} />
                    {errors.name && <span className="field-error">{errors.name}</span>}
                </label>
                <label>
                    Phone (Whatsapp)
                    <input name='phone' type='tel' value={form.phone} onChange={handleChange} autoComplete='tel' aria-invalid={Boolean(errors.phone)}/>
                    {errors.name && <span className="field-error">{errors.phone}</span>}
                </label>
                <label>
                    Delivery address  
                    <textarea name='address'value={form.address}onChange={handleChange} rows={3} autoComplete='street-address' aria-invalid={Boolean(errors.address)}/>
                    {errors.name && <span className="field-error">{errors.address}</span>}
                </label>
                <label>
                    Notes (optional)
                    <textarea name='notes' value={form.notes} onChange={handleChange} rows={2}/>
                    {errors.name && <span className="field-error">{errors.notes}</span>}
                </label>

                <button type="submit" disabled={mutation.isPending}>
                    {mutation.isPending ? 'Placing order...' : 'Place order'}
                </button>

                {mutation.isError && (
                    <div role="alert" className="form-error">
                        <p>{mutation.error.message}</p>
                        {mutation.error instanceof ApiError && mutation.error.details.length > 0 && (
                            <ul>
                                {mutation.error.details.map((detail) => (
                                    <li key={detail}>{detail}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </form>
        </section>
    )
}