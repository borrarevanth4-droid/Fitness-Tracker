fetch('https://openrouter.ai/api/v1/models')
  .then(r => r.json())
  .then(d => d.data
    .filter(m => m.pricing && m.pricing.prompt === '0')
    .map(m => m.id + ' | ctx:' + m.context_length)
    .join('\n')
  )
  .then(console.log)
  .catch(console.error);
