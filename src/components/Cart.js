import React from 'react';
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';

function Cart({ items, onUpdateQuantity, onRemoveItem, onCheckout }) {
  
  // Calculate totals
  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.08; // 8% tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const getTotalItems = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2>
          <ShoppingCart size={24} />
          Shopping Cart
        </h2>
        <div className="cart-badge">
          {getTotalItems()} items
        </div>
      </div>

      {items.length === 0 ? (
        <div className="cart-empty">
          <ShoppingCart size={60} />
          <p>Your cart is empty</p>
          <small>Start scanning items to add them</small>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {items.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-emoji">
                  {item.product?.image || '📦'}
                </div>
                
                <div className="cart-item-details">
                  <h3>{item.product?.name || item.name}</h3>
                  <p className="item-price">${item.price.toFixed(2)} each</p>
                  {item.confidence && (
                    <small className="item-confidence">
                      {(item.confidence * 100).toFixed(1)}% match
                    </small>
                  )}
                </div>

                <div className="cart-item-controls">
                  <div className="quantity-controls">
                    <button 
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      className="btn-quantity"
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    
                    <span className="quantity-display">{item.quantity}</span>
                    
                    <button 
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className="btn-quantity"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <div className="item-total">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>

                  <button 
                    onClick={() => onRemoveItem(item.id)}
                    className="btn-remove"
                    title="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${calculateSubtotal().toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Tax (8%):</span>
              <span>${calculateTax().toFixed(2)}</span>
            </div>
            <div className="summary-row summary-total">
              <span>Total:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>

            <button 
              onClick={onCheckout}
              className="btn btn-checkout"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;