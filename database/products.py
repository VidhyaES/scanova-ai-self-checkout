"""
Product Database - Stores all fruit/vegetable information
"""

PRODUCTS = {
    'apple': {
        'name': 'Apple',
        'price': 2.99,
        'unit': 'per lb',
        'category': 'fruit',
        'image': '🍎',
        'barcode': '123456001',
        'description': 'Fresh, crispy red apples',
        'nutrition': '95 calories per serving',
        'origin': 'Local Farm'
    },
    'banana': {
        'name': 'Banana',
        'price': 1.49,
        'unit': 'per lb',
        'category': 'fruit',
        'image': '🍌',
        'barcode': '123456002'
    },
    'orange': {
        'name': 'Orange',
        'price': 3.49,
        'unit': 'per lb',
        'category': 'fruit',
        'image': '🍊',
        'barcode': '123456003'
    },
    'mango': {
        'name': 'Mango',
        'price': 4.99,
        'unit': 'each',
        'category': 'fruit',
        'image': '🥭',
        'barcode': '123456004'
    },
    'watermelon': {
        'name': 'Watermelon',
        'price': 5.99,
        'unit': 'each',
        'category': 'fruit',
        'image': '🍉',
        'barcode': '123456005'
    },
    'tomato': {
        'name': 'Tomato',
        'price': 2.99,
        'unit': 'per lb',
        'category': 'vegetable',
        'image': '🍅',
        'barcode': '123456006'
    },
    'potato': {
        'name': 'Potato',
        'price': 1.99,
        'unit': 'per lb',
        'category': 'vegetable',
        'image': '🥔',
        'barcode': '123456007'
    },
    'carrot': {
        'name': 'Carrot',
        'price': 2.49,
        'unit': 'per lb',
        'category': 'vegetable',
        'image': '🥕',
        'barcode': '123456008'
    },
    'cucumber': {
        'name': 'Cucumber',
        'price': 1.99,
        'unit': 'each',
        'category': 'vegetable',
        'image': '🥒',
        'barcode': '123456009'
    },
    'bell pepper': {
        'name': 'Bell Pepper',
        'price': 3.99,
        'unit': 'per lb',
        'category': 'vegetable',
        'image': '🫑',
        'barcode': '123456010'
    },
    # Add more products for your other classes
    'onion': {'name': 'Onion', 'price': 1.79, 'unit': 'per lb', 'category': 'vegetable', 'image': '🧅', 'barcode': '123456011'},
    'garlic': {'name': 'Garlic', 'price': 1.99, 'unit': 'per lb', 'category': 'vegetable', 'image': '🧄', 'barcode': '123456012'},
    'lettuce': {'name': 'Lettuce', 'price': 2.49, 'unit': 'each', 'category': 'vegetable', 'image': '🥬', 'barcode': '123456013'},
    'grapes': {'name': 'Grapes', 'price': 4.99, 'unit': 'per lb', 'category': 'fruit', 'image': '🍇', 'barcode': '123456014'},
    'lemon': {'name': 'Lemon', 'price': 0.79, 'unit': 'each', 'category': 'fruit', 'image': '🍋', 'barcode': '123456015'},
}

TAX_RATE = 0.08  # 8% tax

def get_product(product_name):
    """Get product details by name"""
    product_name = product_name.lower()
    return PRODUCTS.get(product_name, None)

def get_all_products():
    """Get all products"""
    return PRODUCTS

def calculate_total(cart_items):
    """
    Calculate total price including tax
    cart_items = [{'name': 'apple', 'quantity': 2}, ...]
    """
    subtotal = 0
    for item in cart_items:
        product = get_product(item['name'])
        if product:
            subtotal += product['price'] * item['quantity']
    
    tax = subtotal * TAX_RATE
    total = subtotal + tax
    
    return {
        'subtotal': round(subtotal, 2),
        'tax': round(tax, 2),
        'total': round(total, 2)
    }