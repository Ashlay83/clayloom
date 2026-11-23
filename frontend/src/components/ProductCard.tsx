import type { Product } from "../types";

type ProductCardProps= {
    product:Product;
}

const priceFormatter  = new Intl.NumberFormat('en-IN',{
    style:"currency",
    currency:"INR",
    maximumFractionDigits:0,
});

const  ProductCard = ({product}:ProductCardProps)=>{
    const {name, price,description, category , inStock}= product;
return (
    <article className={inStock ? 'product-card' : 'product-card sold-out'}>
      <span className="product-category">{category}</span>
      <h3>{name}</h3>
      <p className="product-description">{description}</p>
      <div className="product-footer">
        <span className="product-price">{priceFormatter.format(price)}</span>
        {!inStock && <span className="badge">Sold out</span>}
      </div>
    </article>
  );
}

export default ProductCard;