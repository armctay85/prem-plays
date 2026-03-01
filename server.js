const express = require('express');
const path = require('path');
const authRouter = require('./auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use('/api/auth', authRouter);

// Login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// Dashboard (protected)
app.get('/dashboard', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Prem Plays - Dashboard</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; background: #0A0A0F; color: #F0F0F0; padding: 40px; }
        h1 { margin-bottom: 20px; }
        .content { max-width: 800px; }
        .picks { background: #16161F; border: 1px solid rgba(255,255,255,0.08); padding: 20px; border-radius: 12px; }
        button { background: #6C3DFF; color: white; padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; }
      </style>
    </head>
    <body>
      <h1>Welcome to Prem Plays</h1>
      <div class="content">
        <div class="picks">
          <h2>This Week's EPL Picks</h2>
          <p>Member-only content will load here.</p>
        </div>
      </div>
      <button onclick="logout()">Logout</button>
      <script>
        function logout() {
          localStorage.removeItem('token');
          location.href = '/';
        }
      </script>
    </body>
    </html>
  `);
});

// Default: homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Prem Plays with auth running on port ${PORT}`);
  console.log(`   Homepage: http://localhost:${PORT}`);
  console.log(`   Login: http://localhost:${PORT}/login`);
});
