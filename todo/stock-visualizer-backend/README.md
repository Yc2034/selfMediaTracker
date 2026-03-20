# Stock Visualizer Backend

A simple Node.js/Express proxy server that handles Yahoo Finance API requests to bypass CORS restrictions in the browser.

## Why This Backend?

**The Problem:** Browsers enforce CORS (Cross-Origin Resource Sharing) security policies that prevent direct API calls from web pages to Yahoo Finance.

**The Solution:** This backend server acts as a proxy:
1. Your React app sends requests to this backend (same origin, no CORS issues)
2. This backend fetches data from Yahoo Finance (server-to-server, no CORS restrictions)
3. The backend returns the data to your React app

## Features

- **CORS Proxy**: Bypasses browser CORS restrictions
- **Single Stock Endpoint**: Fetch data for one ticker
- **Batch Endpoint**: Fetch multiple tickers efficiently in parallel
- **Error Handling**: Proper error messages and status codes
- **Health Check**: Endpoint to verify server is running

## Installation

```bash
cd stock-visualizer-backend
npm install
```

## Usage

### Development Mode

```bash
npm run dev
```

The server will start on `http://localhost:3001` with auto-reload on file changes.

### Production Mode

```bash
npm start
```

## API Endpoints

### Health Check

```
GET /health
```

Response:
```json
{
  "status": "ok",
  "message": "Stock Visualizer Backend is running"
}
```

### Get Single Stock

```
GET /api/stock/:ticker?period1=<timestamp>&period2=<timestamp>&interval=<interval>
```

Parameters:
- `ticker`: Stock ticker symbol (e.g., AAPL, MSFT)
- `period1`: Start date as Unix timestamp (seconds)
- `period2`: End date as Unix timestamp (seconds)
- `interval`: Data interval (1d, 1wk, 1mo) - optional, defaults to 1d

Example:
```bash
curl "http://localhost:3001/api/stock/AAPL?period1=1704067200&period2=1735689600&interval=1d"
```

### Batch Fetch Multiple Stocks

```
POST /api/stocks/batch
Content-Type: application/json

{
  "tickers": ["AAPL", "MSFT", "NVDA"],
  "period1": 1704067200,
  "period2": 1735689600,
  "interval": "1d"
}
```

Response:
```json
{
  "successful": [
    {
      "ticker": "AAPL",
      "success": true,
      "data": { ... }
    }
  ],
  "failed": [],
  "summary": {
    "total": 3,
    "succeeded": 3,
    "failed": 0
  }
}
```

## Environment Variables

- `PORT`: Server port (default: 3001)

Create a `.env` file:
```bash
PORT=3001
```

## Deployment

### Deploy to Heroku

```bash
# Login to Heroku
heroku login

# Create app
heroku create your-stock-backend

# Deploy
git push heroku main

# Set environment variables if needed
heroku config:set NODE_ENV=production
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Railway/Render

Push to GitHub and connect your repository in Railway or Render dashboard.

## Connecting Frontend

After deploying the backend, update the frontend's API URL:

1. Create `.env` file in the frontend:
```bash
VITE_API_URL=https://your-deployed-backend.com
```

2. For local development, it defaults to `http://localhost:3001`

## Security Notes

- This is a simple proxy for development/personal use
- For production, consider:
  - Rate limiting
  - API key authentication
  - Request validation
  - Caching to reduce Yahoo Finance API calls

## License

MIT
