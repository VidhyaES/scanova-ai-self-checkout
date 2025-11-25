import React from 'react';
import { ShoppingCart, Info } from 'lucide-react';

/**
 * ProductCard Component
 * Displays individual product information with add to cart functionality
 * 
 * Props:
 * - product: Object containing product details
 * - onAddToCart: Function to handle adding product to cart
 * - showDetails: Boolean to show/hide detailed information
 */
function ProductCard({ product, onAddToCart, showDetails = false }) {
  
  if (!product) {
    return null;
  }

  const {
    name,
    price,
    unit,
    category,
    image,
    barcode,
    description,
    photo
  } = product;

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart({
        name: name.toLowerCase(),
        price: price,
        quantity: 1,
        product: product
      });
    }
  };

  return (
    <div className="product-card">
      {/* Product Image/Emoji */}
      <div className="product-image">
        {photo ? (
          <img src={photo} alt={name} />
        ) : (
          <span className="product-emoji">{image || '📦'}</span>
        )}
        
        {/* Category Badge */}
        <div className={`category-badge ${category}`}>
          {category}
        </div>
      </div>

      {/* Product Info */}
      <div className="product-info">
        <h3 className="product-name">{name}</h3>
        
        <div className="product-pricing">
          <span className="product-price">${price.toFixed(2)}</span>
          <span className="product-unit">{unit}</span>
        </div>

        {showDetails && description && (
          <p className="product-description">{description}</p>
        )}

        {showDetails && barcode && (
          <div className="product-barcode">
            <small>Barcode: {barcode}</small>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="product-actions">
        <button 
          className="btn-add-to-cart"
          onClick={handleAddToCart}
          title={`Add ${name} to cart`}
        >
          <ShoppingCart size={18} />
          Add to Cart
        </button>

        {showDetails && (
          <button 
            className="btn-info"
            title="Product information"
          >
            <Info size={18} />
          </button>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
