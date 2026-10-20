"""Provider transport only; all outputs still pass ANWE evidence validation."""
import os
import re
import uuid
from .common import ServiceError

def provider():
    return os.environ.get('AI_PROVIDER','openai').strip().lower()

def model():
    return os.environ.get('GEMINI_MODEL','gemini-3.5-flash-lite') if provider()=='gemini' else os.environ.get('OPENAI_MODEL','')

def configured():
    if provider() not in ('gemini','openai'):return False
    key='GEMINI_API_KEY' if provider()=='gemini' else 'OPENAI_API_KEY'
    return bool(os.environ.get(key,'').strip() and model().strip())

def disabled_reason():
    if provider()=='gemini':return 'AI disabled: set GEMINI_API_KEY in your private .env, then restart the server. Get a key at Google AI Studio. No simulated answer is substituted.'
    if provider()=='openai':return 'AI disabled: configure OPENAI_API_KEY and OPENAI_MODEL in .env, or choose AI_PROVIDER=gemini. No simulated answer is substituted.'
    return 'Unsupported AI_PROVIDER. Choose gemini or openai in .env.'

def gemini_schema(value):
    # Gemini supports a subset. ANWE validates the full contract server-side.
    if isinstance(value,list):return [gemini_schema(v) for v in value]
    if isinstance(value,dict):return {k:gemini_schema(v) for k,v in value.items() if k!='pattern' and not (k=='enum' and value.get('type')=='boolean')}
    return value

def generate(body,request):
    if provider()=='openai':
        return request('https://api.openai.com/v1/responses',method='POST',headers={'Authorization':'Bearer '+os.environ['OPENAI_API_KEY']},json=body,timeout=90).json()
    if provider()!='gemini':raise ServiceError(disabled_reason(),503)
    name=model()
    if not re.fullmatch(r'gemini-[a-zA-Z0-9.\-]+',name):raise ServiceError('Invalid GEMINI_MODEL identifier.',400)
    payload={'systemInstruction':{'parts':[{'text':body['instructions']}]},
             'contents':[{'role':'user','parts':[{'text':body['input'][0]['content']}]}],
             'generationConfig':{'maxOutputTokens':body['max_output_tokens'],'responseMimeType':'application/json',
                                 'responseJsonSchema':gemini_schema(body['text']['format']['schema'])}}
    try:
        raw=request('https://generativelanguage.googleapis.com/v1beta/models/'+name+':generateContent',
                    method='POST',headers={'x-goog-api-key':os.environ['GEMINI_API_KEY']},json=payload,timeout=90).json()
    except ServiceError as error:
        if error.status==429:raise ServiceError('Gemini quota reached. Wait for your free-tier quota to reset; no paid provider fallback was used.',429) from None
        raise ServiceError('Gemini: '+str(error),error.status) from None
    candidates=raw.get('candidates',[])
    if raw.get('promptFeedback',{}).get('blockReason') or not candidates:raise ServiceError('Gemini did not return an assessment. Try a narrower question.',502)
    candidate=candidates[0]
    if candidate.get('finishReason') not in ('STOP','MAX_TOKENS'):raise ServiceError('Gemini declined or blocked this assessment.',502)
    text=''.join(p.get('text','') for p in candidate.get('content',{}).get('parts',[]) if not p.get('thought'))
    return {'model':raw.get('modelVersion',name),'id':raw.get('responseId') or 'gemini-local-'+uuid.uuid4().hex,
            'status':'completed' if candidate.get('finishReason')=='STOP' else 'incomplete',
            'usage':raw.get('usageMetadata',{}),
            'output':[{'type':'message','content':[{'type':'output_text','text':text}]}]}
