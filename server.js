import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Serve static assets from the repo root
app.use(express.static(path.join(__dirname, '/')));

// Serve env vars to the browser (public keys only)
app.get('/env.js', (req, res) => {
  const SUPABASE_URL = process.env.SUPABASE_URL || '';
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';

  res.type('application/javascript');
  res.send(`window.SUPABASE_URL = '${SUPABASE_URL}';\nwindow.SUPABASE_ANON_KEY = '${SUPABASE_ANON_KEY}';\n`);
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
