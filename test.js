fetch('http://localhost:4000/api/progress', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ weightKg: "79", feedback: "new weight" })
}).then(res => res.text()).then(console.log).catch(console.error);
