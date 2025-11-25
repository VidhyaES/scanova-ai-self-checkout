"""
Helper Functions for Image Processing
"""
import base64
import io
import numpy as np
from PIL import Image

def preprocess_image(image_data, img_size=(244, 244)):
    """
    Convert base64 image to numpy array for model
    
    Args:
        image_data: base64 encoded image string
        img_size: tuple (width, height)
    
    Returns:
        numpy array ready for model prediction
    """
    try:
        # Remove data URL prefix if present
        if ',' in image_data:
            image_data = image_data.split(',')[1]
        
        # Decode base64
        image_bytes = base64.b64decode(image_data)
        
        # Open image
        image = Image.open(io.BytesIO(image_bytes))
        
        # Convert to RGB (in case it's RGBA or grayscale)
        image = image.convert('RGB')
        
        # Resize
        image = image.resize(img_size)
        
        # Convert to numpy array
        img_array = np.array(image)
        
        # Normalize to [0, 1]
        img_array = img_array.astype('float32') / 255.0
        
        # Add batch dimension
        img_array = np.expand_dims(img_array, axis=0)
        
        return img_array
    
    except Exception as e:
        raise ValueError(f"Error processing image: {str(e)}")

def format_price(price):
    """Format price to 2 decimal places"""
    return f"${price:.2f}"

def generate_receipt_id():
    """Generate unique receipt ID"""
    import time
    import random
    timestamp = int(time.time())
    random_num = random.randint(1000, 9999)
    return f"RCP-{timestamp}-{random_num}"