import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Order management API for users and admin
    Args: event with httpMethod, body for order operations
    Returns: HTTP response with order data
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Admin-Password',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    conn.autocommit = True
    
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            if method == 'GET':
                user_id = event.get('queryStringParameters', {}).get('user_id')
                order_id = event.get('queryStringParameters', {}).get('order_id')
                admin_password = event.get('headers', {}).get('X-Admin-Password')
                
                if order_id:
                    cur.execute("""
                        SELECT o.id, o.user_id, o.total_amount, o.status, o.delivery_address, o.created_at,
                               u.full_name, u.email, u.phone
                        FROM orders o
                        JOIN users u ON o.user_id = u.id
                        WHERE o.id = %s
                    """, (order_id,))
                    order = cur.fetchone()
                    
                    if not order:
                        return {
                            'statusCode': 404,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({'error': 'Order not found'})
                        }
                    
                    cur.execute("""
                        SELECT oi.quantity, oi.price, p.name, p.image
                        FROM order_items oi
                        LEFT JOIN plants p ON oi.plant_id = p.id
                        WHERE oi.order_id = %s
                    """, (order_id,))
                    items = [dict(row) for row in cur.fetchall()]
                    
                    order = dict(order)
                    order['items'] = items
                    
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps(order)
                    }
                
                if admin_password:
                    cur.execute("""
                        SELECT o.id, o.user_id, o.total_amount, o.status, o.delivery_address, o.created_at,
                               u.full_name, u.email, u.phone
                        FROM orders o
                        JOIN users u ON o.user_id = u.id
                        ORDER BY o.created_at DESC
                    """)
                    orders = [dict(row) for row in cur.fetchall()]
                    
                    for order in orders:
                        cur.execute("""
                            SELECT oi.quantity, oi.price, p.name
                            FROM order_items oi
                            LEFT JOIN plants p ON oi.plant_id = p.id
                            WHERE oi.order_id = %s
                        """, (order['id'],))
                        order['items'] = [dict(row) for row in cur.fetchall()]
                    
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps(orders)
                    }
                
                if user_id:
                    cur.execute("""
                        SELECT o.id, o.total_amount, o.status, o.delivery_address, o.created_at
                        FROM orders o
                        WHERE o.user_id = %s
                        ORDER BY o.created_at DESC
                    """, (user_id,))
                    orders = [dict(row) for row in cur.fetchall()]
                    
                    for order in orders:
                        cur.execute("""
                            SELECT oi.quantity, oi.price, p.name, p.image
                            FROM order_items oi
                            LEFT JOIN plants p ON oi.plant_id = p.id
                            WHERE oi.order_id = %s
                        """, (order['id'],))
                        order['items'] = [dict(row) for row in cur.fetchall()]
                    
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps(orders)
                    }
                
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing required parameters'})
                }
            
            elif method == 'POST':
                body_data = json.loads(event.get('body', '{}'))
                user_id = body_data.get('user_id')
                items = body_data.get('items', [])
                delivery_address = body_data.get('delivery_address', '')
                
                if not user_id or not items:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Missing user_id or items'})
                    }
                
                total_amount = sum(item['price'] * item['quantity'] for item in items)
                
                cur.execute(
                    "INSERT INTO orders (user_id, total_amount, delivery_address, status) VALUES (%s, %s, %s, %s) RETURNING id",
                    (user_id, total_amount, delivery_address, 'pending')
                )
                order_id = cur.fetchone()['id']
                
                for item in items:
                    cur.execute(
                        "INSERT INTO order_items (order_id, plant_id, quantity, price) VALUES (%s, %s, %s, %s)",
                        (order_id, item['plant_id'], item['quantity'], item['price'])
                    )
                
                cur.execute("DELETE FROM cart_items WHERE user_id = %s", (user_id,))
                
                return {
                    'statusCode': 201,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'order_id': order_id, 'total_amount': float(total_amount)})
                }
            
            elif method == 'PUT':
                admin_password = event.get('headers', {}).get('X-Admin-Password')
                
                if not admin_password:
                    return {
                        'statusCode': 401,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Unauthorized'})
                    }
                
                body_data = json.loads(event.get('body', '{}'))
                order_id = body_data.get('order_id')
                status = body_data.get('status')
                
                if not order_id or not status:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Missing order_id or status'})
                    }
                
                cur.execute(
                    "UPDATE orders SET status = %s WHERE id = %s RETURNING id, status",
                    (status, order_id)
                )
                
                result = cur.fetchone()
                
                if result:
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps(dict(result))
                    }
                
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Order not found'})
                }
    
    finally:
        conn.close()
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'})
    }
