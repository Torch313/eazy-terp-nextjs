const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/mood', async (req, res) => {
  try {
    // Use dynamic import for node-fetch
    const fetch = (await import('node-fetch')).default;
    
    const response = await fetch('http://localhost:5678/webhook/terpene-mood-intake', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Failed to fetch from n8n' });
  }
});

app.listen(3001, () => {
  console.log('Proxy server running on http://localhost:3001');
});