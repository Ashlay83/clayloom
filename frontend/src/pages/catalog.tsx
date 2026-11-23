 import {useQuery} from '@tanstack/react-query'
 import { getProducts } from '../services/products'
 import ProductCard  from '../components/ProductCard'

 const Catalog=()=>{
    const {data:products, isPending, isError,error}= useQuery({
        queryKey:['products'],
        queryFn:getProducts,
    });

    if(isPending) return <p>Loading Products....</p>;
    if(isError) return <p>Could not load Products: {error.message}</p>;
    if(products.length===0) return <p>No Products yet </p>;

    return (
        <section className='catalog'>
            <h1>Shop</h1>
            <div className='product-grid'>
                {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
            </div>
             </section>
    )

 }
export default Catalog;