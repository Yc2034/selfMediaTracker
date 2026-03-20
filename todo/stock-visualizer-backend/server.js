import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Stock Visualizer Backend is running' });
});

// Yahoo Finance proxy endpoint
app.get('/api/stock/:ticker', async (req, res) => {
  try {
    const { ticker } = req.params;
    const { period1, period2, interval = '1d' } = req.query;

    // Validate required parameters
    if (!period1 || !period2) {
      return res.status(400).json({
        error: 'Missing required parameters: period1 and period2'
      });
    }

    // Build Yahoo Finance API URL
    const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?period1=${period1}&period2=${period2}&interval=${interval}`;

    console.log(`Fetching data for ${ticker} from Yahoo Finance...`);

    // Make request to Yahoo Finance
    const response = await axios.get(yahooUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    // Return the data
    res.json(response.data);

  } catch (error) {
    console.error('Error fetching stock data:', error.message);

    if (error.response) {
      // Yahoo Finance returned an error
      res.status(error.response.status).json({
        error: 'Failed to fetch stock data from Yahoo Finance',
        details: error.response.data
      });
    } else {
      // Network or other error
      res.status(500).json({
        error: 'Internal server error',
        details: error.message
      });
    }
  }
});

// Batch endpoint to fetch multiple stocks
app.post('/api/stocks/batch', async (req, res) => {
  try {
    const { tickers, period1, period2, interval = '1d' } = req.body;

    if (!tickers || !Array.isArray(tickers) || tickers.length === 0) {
      return res.status(400).json({
        error: 'Missing or invalid tickers array'
      });
    }

    if (!period1 || !period2) {
      return res.status(400).json({
        error: 'Missing required parameters: period1 and period2'
      });
    }

    console.log(`Fetching batch data for ${tickers.length} tickers...`);

    // Fetch all stocks in parallel
    const promises = tickers.map(ticker => {
      const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?period1=${period1}&period2=${period2}&interval=${interval}`;

      return axios.get(yahooUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      }).then(response => ({
        ticker,
        success: true,
        data: response.data
      })).catch(error => ({
        ticker,
        success: false,
        error: error.message
      }));
    });

    const results = await Promise.all(promises);

    // Separate successful and failed requests
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    res.json({
      successful,
      failed,
      summary: {
        total: tickers.length,
        succeeded: successful.length,
        failed: failed.length
      }
    });

  } catch (error) {
    console.error('Error in batch request:', error.message);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Stock Visualizer Backend running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📈 API endpoint: http://localhost:${PORT}/api/stock/:ticker`);
});
