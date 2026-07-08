import json
import os
import urllib.request
import urllib.error


def handler(event: dict, context) -> dict:
    '''Прокси-функция AI Engine для провайдера ChatGPT (OpenAI).
    Принимает список сообщений (messages) и параметры вызова, обращается
    к OpenAI Chat Completions API с ключом из секретов проекта, возвращает
    ответ модели в едином формате AIResponse (content, raw).
    Args: event - dict с httpMethod, body (JSON: messages, params, modelId)
          context - объект с request_id, атрибутами исполнения
    Returns: HTTP response dict с телом {content, raw} или {error}
    '''
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token, X-Session-Id',
                'Access-Control-Max-Age': '86400',
            },
            'body': '',
        }

    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
    }

    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Method not allowed'}),
        }

    api_key = os.environ.get('OPENAI_API_KEY')
    if not api_key:
        return {
            'statusCode': 500,
            'headers': cors_headers,
            'body': json.dumps({'error': 'OPENAI_API_KEY is not configured'}),
        }

    try:
        body = json.loads(event.get('body') or '{}')
    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Invalid JSON body'}),
        }

    messages = body.get('messages', [])
    params = body.get('params') or {}

    openai_messages = [
        {'role': m.get('role'), 'content': m.get('content')}
        for m in messages
        if m.get('role') and m.get('content') is not None
    ]

    model = params.get('model') or 'gpt-4o-mini'
    payload = {
        'model': model,
        'messages': openai_messages,
    }
    if 'temperature' in params:
        payload['temperature'] = params['temperature']
    if 'maxTokens' in params:
        payload['max_tokens'] = params['maxTokens']

    request = urllib.request.Request(
        url='https://api.openai.com/v1/chat/completions',
        data=json.dumps(payload).encode('utf-8'),
        headers={
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json',
        },
        method='POST',
    )

    try:
        with urllib.request.urlopen(request, timeout=25) as response:
            raw = json.loads(response.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8')
        return {
            'statusCode': e.code,
            'headers': cors_headers,
            'body': json.dumps({'error': f'OpenAI API error: {error_body}'}),
        }
    except urllib.error.URLError as e:
        return {
            'statusCode': 502,
            'headers': cors_headers,
            'body': json.dumps({'error': f'Failed to reach OpenAI API: {str(e.reason)}'}),
        }

    content = ''
    choices = raw.get('choices') or []
    if choices:
        content = (choices[0].get('message') or {}).get('content', '')

    return {
        'statusCode': 200,
        'headers': cors_headers,
        'body': json.dumps({'content': content, 'raw': raw}),
    }
