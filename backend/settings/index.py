import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для управления настройками сайта - получение и обновление
    Args: event - dict с httpMethod, body, headers
          context - объект с атрибутами request_id, function_name
    Returns: HTTP response dict
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Password',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    db_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(db_url)
    
    try:
        if method == 'GET':
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute('SELECT key, value FROM site_settings WHERE key != %s', ('admin_password',))
                settings = cur.fetchall()
                
                settings_dict = {s['key']: s['value'] for s in settings}
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(settings_dict)
                }
        
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            password = body_data.get('password')
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("SELECT value FROM site_settings WHERE key = 'admin_password'")
                result = cur.fetchone()
                stored_password = result['value'] if result else 'admin123'
                
                if password == stored_password:
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'authenticated': True})
                    }
                else:
                    return {
                        'statusCode': 401,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'authenticated': False})
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
        
        if method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            
            with conn.cursor() as cur:
                for key, value in body_data.items():
                    if key != 'admin_password':
                        cur.execute(
                            '''INSERT INTO site_settings (key, value) 
                               VALUES (%s, %s) 
                               ON CONFLICT (key) 
                               DO UPDATE SET value = %s, updated_at = CURRENT_TIMESTAMP''',
                            (key, value, value)
                        )
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
