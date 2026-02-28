const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sessionRoutes = require('./routes/session.routes');
const sessionRoutesEnhanced = require('./routes/session.routes.enhanced');
const questionRoutes = require('./routes/question.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/session', sessionRoutes);
app.use('/hunter', sessionRoutesEnhanced); // Enhanced Cognitive Hunter System
app.use('/question', questionRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Hunter Protocol - Intelligence Layer</title>
      <style>
        body { font-family: 'Courier New', monospace; background: #0a0a0a; color: #00ff00; padding: 40px; }
        .container { max-width: 900px; margin: 0 auto; }
        h1 { color: #ff0000; text-shadow: 0 0 10px #ff0000; }
        .status { color: #00ff00; font-weight: bold; }
        .endpoint { background: #1a1a1a; padding: 15px; margin: 10px 0; border-left: 3px solid #ff0000; }
        .method { color: #ffaa00; font-weight: bold; }
        code { background: #2a2a2a; padding: 2px 6px; color: #00ffff; }
        a { color: #00ffff; text-decoration: none; }
        a:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🎯 THE HUNTER PROTOCOL</h1>
        <h2>Intelligence Layer v1.0.0</h2>
        <p class="status">STATUS: OPERATIONAL</p>
        
        <h3>Available Endpoints:</h3>
        
        <div class="endpoint">
          <span class="method">GET</span> <code>/health</code>
          <p>Health check endpoint</p>
        </div>
        
        <div class="endpoint">
          <span class="method">POST</span> <code>/session/analyze</code>
          <p>Analyze user behavior and generate cognitive profile</p>
          <p><strong>Body:</strong> { questionId, userId, timeTaken, incorrectAttempts, hintUsage, edgeCaseFailures, repeatedMistakes, panicUnderTimer }</p>
        </div>
        
        <div class="endpoint">
          <span class="method">GET</span> <code>/question/adaptive</code>
          <p>Get next adaptive question based on weaknesses</p>
          <p><strong>Query:</strong> ?weaknessTags=tag1,tag2&previousQuestions=q001,q002</p>
        </div>
        
        <h3>Quick Test:</h3>
        <p>Try: <a href="/health" target="_blank">/health</a></p>
        
        <h3>Documentation:</h3>
        <p>See README.md for complete API documentation and examples</p>
        
        <hr style="border-color: #333; margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">Group B - Intelligence Layer | Hackathon MVP</p>
      </div>
    </body>
    </html>
  `);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Hunter Protocol Intelligence Layer' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

app.listen(PORT, () => {
  console.log(`🎯 Hunter Protocol Intelligence Layer running on port ${PORT}`);
});

module.exports = app;
