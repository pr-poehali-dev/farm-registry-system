import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Shopping cart management API
    Args: event with httpMethod, body for cart operations
    Returns: HTTP response with cart data
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    user_id = event.get('headers', {}).get('X-User-Id')
    
    if not user_id:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'User not authenticated'}),
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    conn.autocommit = True
    
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            if method == 'GET':
                cur.execute("""
                    SELECT ci.id, ci.quantity, p.id as plant_id, p.name, p.price, p.image, p.category
                    FROM cart_items ci
                    JOIN plants p ON ci.plant_id = p.id
                    WHERE ci.user_id = %s
                """, (user_id,))
                
                items = [dict(row) for row in cur.fetchall()]
                
                total = sum(item['price'] * item['quantity'] for item in items)
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'items': items, 'total': float(total)}),
                    'isBase64Encoded': False
                }
            
            elif method == 'POST':
                body_data = json.loads(event.get('body', '{}'))
                plant_id = body_data.get('plant_id')
                quantity = body_data.get('quantity', 1)
                
                cur.execute(
                    "SELECT id, quantity FROM cart_items WHERE user_id = %s AND plant_id = %s",
                    (user_id, plant_id)
                )
                existing = cur.fetchone()
                
                if existing:
                    new_quantity = existing['quantity'] + quantity
                    cur.execute(
                        "UPDATE cart_items SET quantity = %s WHERE id = %s RETURNING id, quantity",
                        (new_quantity, existing['id'])
                    )
                else:
                    cur.execute(
                        "INSERT INTO cart_items (user_id, plant_id, quantity) VALUES (%s, %s, %s) RETURNING id, quantity",
                        (user_id, plant_id, quantity)
                    )
                
                result = dict(cur.fetchone())
                
                return {
                    'statusCode': 201,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(result),
                    'isBase64Encoded': False
                }
            
            elif method == 'PUT':
                body_data = json.loads(event.get('body', '{}'))
                item_id = body_data.get('id')
                quantity = body_data.get('quantity')
                
                cur.execute(
                    "UPDATE cart_items SET quantity = %s WHERE id = %s AND user_id = %s RETURNING id, quantity",
                    (quantity, item_id, user_id)
                )
                
                result = cur.fetchone()
                
                if result:
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps(dict(result)),
                        'isBase64Encoded': False
                    }
                
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Item not found'}),
                    'isBase64Encoded': False
                }
            
            elif method == 'DELETE':
                params = event.get('queryStringParameters', {})
                item_id = params.get('id')
                
                if item_id:
                    cur.execute("DELETE FROM cart_items WHERE id = %s AND user_id = %s", (item_id, user_id))
                else:
                    cur.execute("DELETE FROM cart_items WHERE user_id = %s", (user_id,))
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True}),
                    'isBase64Encoded': False
                }
    
    finally:
        conn.close()
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }