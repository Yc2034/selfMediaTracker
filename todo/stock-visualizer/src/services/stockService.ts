import type { StockData, IntervalType } from '../types/stock';

/**
 * Fetch stock data from Yahoo Finance API
 * Using a CORS proxy to bypass browser restrictions
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

    // Using Yahoo Finance API directly
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?period1=${period1}&period2=${period2}&interval=${interval}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch data for ${ticker}`);
    }

    const data = await response.json();

    // Parse Yahoo Finance response
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
 * Fetch data for multiple tickers
 */
export async function fetchMultipleStocks(
  tickers: string[],
  startDate: Date,
  endDate: Date,
  interval: IntervalType = '1d'
): Promise<StockData[]> {
  const promises = tickers.map(ticker =>
    fetchStockData(ticker, startDate, endDate, interval)
  );

  try {
    const results = await Promise.all(promises);
    return results;
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
