import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { formatPrice } from '../utils/format';

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const { id, name, price, description, category, inStock } = product;

  return (
    <article className={inStock ? 'product-card' : 'product-card sold-out'}>
      <span className="product-category">{category}</span>
      <h3>
        <Link to={`/products/${id}`}>{name}</Link>
      </h3>
      <p className="product-description">{description}</p>
      <div className="product-footer">
        <span className="product-price">{formatPrice(price)}</span>
        {!inStock && <span className="badge">Sold out</span>}
      </div>
    </article>
  );
}