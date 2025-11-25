import React, { useState, useEffect } from 'react';
import Camera from './components/Camera';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import ProductBrowser from './components/ProductBrowser';
import { Store, Camera as CameraIcon, ShoppingBag } from 'lucide-react';
import './App.css';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [activeTab, setActiveTab] = useState('scan');
  const [notification, setNotification] = useState(null);

  // Generate unique ID for cart items
  const generateId = () => {
    return Date.now() + Math.random();
  };

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Handle item scanned from camera
  const handleItemScanned = (scannedItem) => {
    // Check if item already exists in cart
    const existingItem = cartItems.find(item => item.name === scannedItem.name);

    if (existingItem) {
      // Increase quantity
      setCartItems(cartItems.map(item =>
        item.name === scannedItem.name
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
      showNotification(`Added another ${scannedItem.product?.name}!`);
    } else {
      // Add new item
      const newItem = {
        id: generateId(),
        name: scannedItem.name,
        price: scannedItem.price,
        quantity: 1,
        confidence: scannedItem.confidence,
        product: scannedItem.product,
        timestamp: new Date().toISOString()
      };
      setCartItems([...cartItems, newItem]);
      showNotification(`${scannedItem.product?.name} added to cart!`);
    }
  };

  // Update item quantity
  const handleUpdateQuantity = (itemId, change) => {
    setCartItems(cartItems.map(item => {
      if (item.id === itemId) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }));
  };

  // Remove item from cart
  const handleRemoveItem = (itemId) => {
    const item = cartItems.find(i => i.id === itemId);
    setCartItems(cartItems.filter(i => i.id !== itemId));
    showNotification(`${item.product?.name} removed from cart`, 'info');
  };

  // Calculate total
  const calculateTotal = () => {
    const subtotal = cartItems.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0
    );
    return subtotal * 1.08; // Including 8% tax
  };

  // Handle checkout completion
  const handleCheckoutComplete = () => {
    setCartItems([]);
    showNotification('Thank you for your purchase!', 'success');
  };

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <Store size={32} />
            <h1>Scanova</h1>
          </div>
          
          <div className="header-info">
            <div className="info-item">
              <small>Items</small>
              <strong>{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</strong>
            </div>
            <div className="info-item">
              <small>Total</small>
              <strong>${calculateTotal().toFixed(2)}</strong>
            </div>
          </div>
        </div>
      </header>
      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={activeTab === 'scan' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('scan')}
        >
          <CameraIcon size={20} />
          Scan Items
        </button>
        <button 
          className={activeTab === 'browse' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('browse')}
        >
          <ShoppingBag size={20} />
          Browse Products
        </button>
      </div>

      {notification && (
        <div className={`notification notification-${notification.type}`}>
          {notification.message}
        </div>
      )}

      <main className="app-main">
        <div className="app-grid">
          {/* Left Side - Camera or Product Browser */}
          <div className="grid-item">
            {activeTab === 'scan' ? (
              <>
                <Camera onItemScanned={handleItemScanned} />
                <div className="instructions">
                  <h3>📖 How to Use</h3>
                  <ol>
                    <li>Click "Start Camera" to begin</li>
                    <li>Position produce item in the frame</li>
                    <li>Click "Scan Item" to recognize</li>
                    <li>Item automatically adds to cart</li>
                    <li>Review cart and checkout</li>
                  </ol>
                </div>
              </>
            ) : (
              <ProductBrowser onAddToCart={handleItemScanned} />
            )}
          </div>

          {/* Right Side - Cart (always visible) */}
          <div className="grid-item">
            <Cart
              items={cartItems}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onCheckout={() => setShowCheckout(true)}
            />
          </div>
        </div>
      </main>

      {/* Notification */}
      {notification && (
        <div className={`notification notification-${notification.type}`}>
          {notification.message}
        </div>
      )}


      {/* Checkout Modal */}
      {showCheckout && (
        <Checkout
          items={cartItems}
          total={calculateTotal()}
          onClose={() => setShowCheckout(false)}
          onComplete={handleCheckoutComplete}
        />
      )}

      {/* Footer */}
      <footer className="app-footer">
        <p>Powered by AI • Safe & Secure Checkout</p>
      </footer>
    </div>
  );
}

export default App;