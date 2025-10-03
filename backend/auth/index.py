import json
import os
import hashlib
import secrets
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def generate_token() -> str:
    return secrets.token_urlsafe(32)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: User authentication and registration API
    Args: event with httpMethod, body containing email, password, full_name
    Returns: HTTP response with user data and auth token
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    conn.autocommit = True
    
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            if method == 'POST':
                body_data = json.loads(event.get('body', '{}'))
                action = body_data.get('action', 'login')
                
                if action == 'register':
                    email = body_data.get('email')
                    password = body_data.get('password')
                    full_name = body_data.get('full_name')
                    phone = body_data.get('phone', '')
                    
                    cur.execute("SELECT id FROM users WHERE email = %s", (email,))
                    if cur.fetchone():
                        return {
                            'statusCode': 400,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({'error': 'Email already registered'}),
                            'isBase64Encoded': False
                        }
                    
                    password_hash = hash_password(password)
                    cur.execute(
                        "INSERT INTO users (email, password_hash, full_name, phone) VALUES (%s, %s, %s, %s) RETURNING id, email, full_name, phone",
                        (email, password_hash, full_name, phone)
                    )
                    user = dict(cur.fetchone())
                    token = generate_token()
                    
                    return {
                        'statusCode': 201,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'user': user, 'token': token}),
                        'isBase64Encoded': False
                    }
                
                elif action == 'login':
                    email = body_data.get('email')
                    password = body_data.get('password')
                    password_hash = hash_password(password)
                    
                    cur.execute(
                        "SELECT id, email, full_name, phone FROM users WHERE email = %s AND password_hash = %s",
                        (email, password_hash)
                    )
                    user = cur.fetchone()
                    
                    if not user:
                        return {
                            'statusCode': 401,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({'error': 'Invalid credentials'}),
                            'isBase64Encoded': False
                        }
                    
                    user = dict(user)
                    token = generate_token()
                    
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'user': user, 'token': token}),
                        'isBase64Encoded': False
                    }
            
            elif method == 'GET':
                auth_token = event.get('headers', {}).get('X-Auth-Token')
                
                if not auth_token:
                    return {
                        'statusCode': 401,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'No token provided'}),
                        'isBase64Encoded': False
                    }
                
                user_id = event.get('queryStringParameters', {}).get('user_id')
                
                if user_id:
                    cur.execute(
                        "SELECT id, email, full_name, phone FROM users WHERE id = %s",
                        (user_id,)
                    )
                    user = cur.fetchone()
                    
                    if user:
                        return {
                            'statusCode': 200,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({'user': dict(user)}),
                            'isBase64Encoded': False
                        }
                
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'User not found'}),
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