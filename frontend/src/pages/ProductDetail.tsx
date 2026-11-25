import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProduct } from '../services/products';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const { data: product, isPending, isError, error } = useQuery({
    queryKey: ['products', id],
    queryFn: () => getProduct(id!), // safe: the query only runs when id exists
    enabled: id !== undefined,
    retry: false, // a missing product won't appear on a retry, so show the error at once
  });

  if (isPending) return <p>Loading...</p>;
  if (isError) {
    return (
      <div>
        <p>{error.message}</p>
        <Link to="/">Back to the shop</Link>
      </div>
    );
  }

  return (
    <article className="product-detail">
      <Link to="/">← Back to the shop</Link>
      <span className="product-category">{product.category}</span>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p className="product-price">{formatPrice(product.price)}</p>

      {product.inStock ? (
        <button
          onClick={() => {
            addItem(product);
            setAdded(true);
          }}
        >
          Add to cart
        </button>
      ) : (
        <button disabled>Sold out</button>
      )}

      {added && (
        <p>
          Added to your cart. <Link to="/cart">View cart</Link>
        </p>
      )}
    </article>
  );
}