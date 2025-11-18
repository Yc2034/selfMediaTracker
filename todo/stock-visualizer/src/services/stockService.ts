import type { StockData, IntervalType } from '../types/stock';

// Backend API URL - change this to your deployed backend URL in production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Fetch stock data via backend proxy
 * The backend handles Yahoo Finance API calls to bypass CORS restrictions
 */
export async function fetchStockData(
  ticker: string,
  startDate: Date,
  endDate: Date,
  interval: IntervalType = '1d'
): Promise<StockData> {
  try {
    const period1 = Math.floor(startDate.getTime() / 1000);
    const period2 = Math.floor(endDate.getTime() / 1000);

    // Call backend proxy instead of Yahoo Finance directly
    const url = `${API_BASE_URL}/api/stock/${ticker}?period1=${period1}&period2=${period2}&interval=${interval}`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to fetch data for ${ticker}`);
    }

    const data = await response.json();

    // Parse Yahoo Finance response (same format as direct API)
    const result = data.chart.result[0];
    const timestamps = result.timestamp;
    const quotes = result.indicators.quote[0];
    const closes = quotes.close;

    const prices = timestamps.map((ts: number, index: number) => ({
      date: new Date(ts * 1000),
      close: closes[index],
    })).filter((price: any) => price.close !== null);

    return {
      ticker,
      prices,
    };
  } catch (error) {
    console.error(`Error fetching data for ${ticker}:`, error);
    throw error;
  }
}

/**
 * Fetch data for multiple tickers using batch endpoint
 */
export async function fetchMultipleStocks(
  tickers: string[],
  startDate: Date,
  endDate: Date,
  interval: IntervalType = '1d'
): Promise<StockData[]> {
  try {
    const period1 = Math.floor(startDate.getTime() / 1000);
    const period2 = Math.floor(endDate.getTime() / 1000);

    // Use batch endpoint for better performance
    const url = `${API_BASE_URL}/api/stocks/batch`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tickers,
        period1,
        period2,
        interval,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch batch stock data');
    }

    const result = await response.json();

    // Process successful results
    const stockData: StockData[] = result.successful.map((item: any) => {
      const chartResult = item.data.chart.result[0];
      const timestamps = chartResult.timestamp;
      const quotes = chartResult.indicators.quote[0];
      const closes = quotes.close;

      const prices = timestamps.map((ts: number, index: number) => ({
        date: new Date(ts * 1000),
        close: closes[index],
      })).filter((price: any) => price.close !== null);

      return {
        ticker: item.ticker,
        prices,
      };
    });

    // Log failed tickers
    if (result.failed.length > 0) {
      console.warn('Some tickers failed to fetch:', result.failed);
    }

    if (stockData.length === 0) {
      throw new Error('No stock data could be fetched');
    }

    return stockData;
  } catch (error) {
    console.error('Error fetching multiple stocks:', error);
    throw error;
  }
}

/**
 * Generate sample stock data for testing
 */
export function generateSampleData(ticker: string, days: number = 365): StockData {
  const prices = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  let price = 100 + Math.random() * 100;

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);

    // Random walk
    const change = (Math.random() - 0.5) * 5;
    price = Math.max(10, price + change);

    prices.push({ date, close: price });
  }

  return { ticker, prices };
}
