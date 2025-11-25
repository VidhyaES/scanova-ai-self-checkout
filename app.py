"""
Smart Supermarket Self-Checkout Backend Server
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
import os
from datetime import datetime

# Import our custom modules
from database.products import get_product, get_all_products, calculate_total
from utils.helpers import preprocess_image, generate_receipt_id

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Allow frontend to connect from different port

# Configuration
MODEL_PATH = r"C:\Users\msi vishnu\Downloads\fruit_class.keras"
IMG_SIZE = (244, 244)

# Your class names (all 36 classes)
CLASS_NAMES = [
    'capsicum', 'sweetcorn', 'orange', 'tomato', 'turnip', 'ginger', 
    'raddish', 'pomegranate', 'pineapple', 'jalepeno', 'apple', 'carrot', 
    'lettuce', 'bell pepper', 'eggplant', 'beetroot', 'kiwi', 'pear', 
    'cabbage', 'cauliflower', 'paprika', 'lemon', 'sweetpotato', 'grapes', 
    'cucumber', 'corn', 'banana', 'garlic', 'chilli pepper', 'watermelon', 
    'mango', 'peas', 'onion', 'potato', 'spinach', 'soy beans'
]

# Load ML model
print("🔄 Loading ML model...")
try:
    model = tf.keras.models.load_model(MODEL_PATH)
    print("✅ Model loaded successfully!")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    model = None

# Store for active shopping sessions (in production, use Redis or database)
shopping_sessions = {}

# ============================================
# API ENDPOINTS
# ============================================

@app.route('/')
def home():
    """API Status endpoint"""
    return jsonify({
        'status': 'online',
        'message': 'Smart Supermarket Self-Checkout API',
        'version': '1.0',
        'model_loaded': model is not None,
        'total_products': len(get_all_products())
    })

@app.route('/api/products', methods=['GET'])
def get_products():
    """Get all available products"""
    try:
        products = get_all_products()
        return jsonify({
            'success': True,
            'products': products,
            'count': len(products)
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/product/<product_name>', methods=['GET'])
def get_product_details(product_name):
    """Get details of a specific product"""
    try:
        product = get_product(product_name)
        if product:
            return jsonify({
                'success': True,
                'product': product
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Product not found'
            }), 404
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/predict', methods=['POST'])
def predict():
    """Predict fruit/vegetable from image"""
    try:
        if model is None:
            return jsonify({
                'success': False,
                'error': 'Model not loaded'
            }), 500
        
        # Get image data from request
        data = request.get_json()
        
        if not data or 'image' not in data:
            return jsonify({
                'success': False,
                'error': 'No image data provided'
            }), 400
        
        # Preprocess image
        image_data = data['image']
        processed_image = preprocess_image(image_data, IMG_SIZE)
        
        # Make prediction
        predictions = model.predict(processed_image, verbose=0)
        
        # Get top prediction
        predicted_idx = np.argmax(predictions[0])
        confidence = float(predictions[0][predicted_idx])
        predicted_class = CLASS_NAMES[predicted_idx]
        
        # Get product details
        product = get_product(predicted_class)
        
        # Get top 3 predictions
        top_3_idx = np.argsort(predictions[0])[-3:][::-1]
        top_3 = [
            {
                'name': CLASS_NAMES[i],
                'confidence': float(predictions[0][i])
            }
            for i in top_3_idx
        ]
        
        return jsonify({
            'success': True,
            'prediction': predicted_class,
            'confidence': confidence,
            'product': product,
            'top_predictions': top_3,
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/cart/calculate', methods=['POST'])
def calculate_cart():
    """Calculate cart total"""
    try:
        data = request.get_json()
        cart_items = data.get('items', [])
        
        result = calculate_total(cart_items)
        
        return jsonify({
            'success': True,
            'calculation': result
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/checkout', methods=['POST'])
def checkout():
    """Process checkout and generate receipt"""
    try:
        data = request.get_json()
        cart_items = data.get('items', [])
        payment_method = data.get('payment_method', 'card')
        
        # Calculate totals
        totals = calculate_total(cart_items)
        
        # Generate receipt
        receipt_id = generate_receipt_id()
        receipt = {
            'receipt_id': receipt_id,
            'timestamp': datetime.now().isoformat(),
            'items': cart_items,
            'subtotal': totals['subtotal'],
            'tax': totals['tax'],
            'total': totals['total'],
            'payment_method': payment_method,
            'status': 'completed'
        }
        
        return jsonify({
            'success': True,
            'receipt': receipt,
            'message': 'Payment processed successfully'
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    """Check if server is healthy"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat()
    })

# ============================================
# RUN SERVER
# ============================================

if __name__ == '__main__':
    print("\n" + "="*50)
    print("🚀 Smart Supermarket Self-Checkout Server")
    print("="*50)
    print(f"📊 Total Products: {len(get_all_products())}")
    print(f"🤖 Model Status: {'✅ Loaded' if model else '❌ Not Loaded'}")
    print("="*50 + "\n")
    
    # Run server
    app.run(
        debug=True,
        host='0.0.0.0',
        port=5000
    )