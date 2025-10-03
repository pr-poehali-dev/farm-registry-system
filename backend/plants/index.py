import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для управления растениями - получение, создание, обновление, удаление
    Args: event - dict с httpMethod, body, queryStringParameters, pathParams
          context - объект с атрибутами request_id, function_name
    Returns: HTTP response dict
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Password',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    db_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(db_url)
    
    try:
        if method == 'GET':
            plant_id = event.get('queryStringParameters', {}).get('id')
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                if plant_id:
                    cur.execute('SELECT * FROM plants WHERE id = %s', (plant_id,))
                    plant = cur.fetchone()
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps(dict(plant) if plant else None, default=str)
                    }
                else:
                    cur.execute('SELECT * FROM plants ORDER BY id')
                    plants = cur.fetchall()
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps([dict(p) for p in plants], default=str)
                    }
        
        admin_password = event.get('headers', {}).get('X-Admin-Password') or event.get('headers', {}).get('x-admin-password')
        
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("SELECT value FROM site_settings WHERE key = 'admin_password'")
            result = cur.fetchone()
            stored_password = result['value'] if result else 'admin123'
        
        if admin_password != stored_password:
            return {
                'statusCode': 401,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Unauthorized'})
            }
        
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            name = body_data.get('name')
            price = body_data.get('price')
            category = body_data.get('category')
            image = body_data.get('image')
            description = body_data.get('description')
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(
                    'INSERT INTO plants (name, price, category, image, description) VALUES (%s, %s, %s, %s, %s) RETURNING *',
                    (name, price, category, image, description)
                )
                new_plant = cur.fetchone()
                conn.commit()
                
                return {
                    'statusCode': 201,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(dict(new_plant), default=str)
                }
        
        if method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            plant_id = body_data.get('id')
            name = body_data.get('name')
            price = body_data.get('price')
            category = body_data.get('category')
            image = body_data.get('image')
            description = body_data.get('description')
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(
                    '''UPDATE plants 
                       SET name = %s, price = %s, category = %s, image = %s, description = %s, updated_at = CURRENT_TIMESTAMP 
                       WHERE id = %s RETURNING *''',
                    (name, price, category, image, description, plant_id)
                )
                updated_plant = cur.fetchone()
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(dict(updated_plant) if updated_plant else None, default=str)
                }
        
        if method == 'DELETE':
            plant_id = event.get('queryStringParameters', {}).get('id')
            
            with conn.cursor() as cur:
                cur.execute('DELETE FROM plants WHERE id = %s', (plant_id,))
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True})
                }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    finally:
        conn.close()