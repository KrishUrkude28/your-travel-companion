const https = require('https');

const key = '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';

const body = JSON.stringify({
  model: "llama-3.3-70b-versatile",
  messages: [
    { role: "system", content: "You are a travel planner. Respond with JSON only." },
    { role: "user", content: 'Create a 1-day Tokyo itinerary. Return JSON: {"title":"...","summary":"...","itinerary":[{"day":1,"title":"...","description":"...","meals":[],"activities":[],"accommodation":"..."}],"tips":[]}' }
  ],
  temperature: 0.7,
  max_tokens: 1024,
  response_format: { type: "json_object" }
});

const options = {
  hostname: 'api.groq.com',
  path: '/openai/v1/chat/completions',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${key}`,
    'Content-Length': Buffer.byteLength(body)
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const parsed = JSON.parse(data);
    if (parsed.choices) {
      console.log('\n✅ GROQ SUCCESS!\n');
      console.log('Model:', parsed.model);
      console.log('Tokens used:', parsed.usage?.total_tokens);
      console.log('\n--- Generated Content ---');
      console.log(parsed.choices[0].message.content.substring(0, 400) + '...');
    } else {
      console.log('\n❌ GROQ FAILED:', JSON.stringify(parsed, null, 2));
    }
  });
});

req.on('error', (e) => console.error('Request error:', e));
req.write(body);
req.end();
