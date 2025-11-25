import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import { API_ENDPOINTS } from '../config';

function ProductBrowser({ onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, fruit, vegetable

  useEffect(() => {
    // Fetch all products from backend
    axios.get(API_ENDPOINTS.PRODUCTS)
      .then(response => {
        if (response.data.success) {
          // Convert products object to array
          const productsArray = Object.entries(response.data.products).map(
            ([key, value]) => ({
              id: key,
              ...value
            })
          );
          setProducts(productsArray);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading products:', error);
        setLoading(false);
      });
  }, []);

  // Filter products by category
  const filteredProducts = products.filter(product => {
    if (filter === 'all') return true;
    return product.category === filter;
  });

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="product-browser">
      <div className="browser-header">
        <h2>Browse Products</h2>
        
        {/* Filter Buttons */}
        <div className="filter-buttons">
          <button 
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All ({products.length})
          </button>
          <button 
            className={filter === 'fruit' ? 'active' : ''}
            onClick={() => setFilter('fruit')}
          >
            Fruits ({products.filter(p => p.category === 'fruit').length})
          </button>
          <button 
            className={filter === 'vegetable' ? 'active' : ''}
            onClick={() => setFilter('vegetable')}
          >
            Vegetables ({products.filter(p => p.category === 'vegetable').length})
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="products-grid">
        {filteredProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            showDetails={true}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="no-products">
          <p>No products found in this category</p>
        </div>
      )}
    </div>
  );
}

export default ProductBrowser;