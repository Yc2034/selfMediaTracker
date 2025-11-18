import type { StockData, NormalizedData, PerformanceMetrics, BaselineType } from '../types/stock';

/**
 * Normalize stock prices based on the baseline type
 */
export function normalizePrices(
  stockDataList: StockData[],
  baseline: BaselineType
): NormalizedData[] {
  if (stockDataList.length === 0) return [];

  // Get all unique dates and sort them
  const allDates = new Set<number>();
  stockDataList.forEach(stock => {
    stock.prices.forEach(price => {
      allDates.add(price.date.getTime());
    });
  });

  const sortedDates = Array.from(allDates).sort((a, b) => a - b);

  // Create a map for each stock's prices
  const priceMap = new Map<string, Map<number, number>>();
  stockDataList.forEach(stock => {
    const map = new Map<number, number>();
    stock.prices.forEach(price => {
      map.set(price.date.getTime(), price.close);
    });
    priceMap.set(stock.ticker, map);
  });

  // Forward fill missing values and normalize
  const normalized: NormalizedData[] = [];
  const lastKnownValues = new Map<string, number>();
  const firstValues = new Map<string, number>();

  sortedDates.forEach(timestamp => {
    const entry: NormalizedData = { date: new Date(timestamp) };

    stockDataList.forEach(stock => {
      const priceAtDate = priceMap.get(stock.ticker)?.get(timestamp);

      if (priceAtDate !== undefined) {
        lastKnownValues.set(stock.ticker, priceAtDate);
        if (!firstValues.has(stock.ticker)) {
          firstValues.set(stock.ticker, priceAtDate);
        }
      }

      const value = lastKnownValues.get(stock.ticker);
      if (value !== undefined) {
        const firstValue = firstValues.get(stock.ticker)!;

        if (baseline === 'first') {
          entry[stock.ticker] = value / firstValue;
        } else {
          // percentage: cumulative return
          entry[stock.ticker] = (value / firstValue) - 1;
        }
      }
    });

    // Only add entries where all stocks have values
    if (stockDataList.every(stock => entry[stock.ticker] !== undefined)) {
      normalized.push(entry);
    }
  });

  return normalized;
}

/**
 * Calculate performance metrics for each stock
 */
export function calculateMetrics(
  stockDataList: StockData[],
  normalizedData: NormalizedData[],
  baseline: BaselineType
): PerformanceMetrics[] {
  if (normalizedData.length === 0) return [];

  const metrics: PerformanceMetrics[] = [];

  stockDataList.forEach(stock => {
    const ticker = stock.ticker;
    const values = normalizedData.map(d => d[ticker] as number).filter(v => v !== undefined);

    if (values.length === 0) return;

    // Get original prices for this ticker
    const originalPrices = stock.prices.map(p => p.close);
    const startPrice = originalPrices[0];
    const endPrice = originalPrices[originalPrices.length - 1];
    const absChange = endPrice - startPrice;

    // Calculate time horizon
    const startDate = normalizedData[0].date;
    const endDate = normalizedData[normalizedData.length - 1].date;
    const horizonDays = Math.max(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
      1
    );
    const horizonYears = Math.max(horizonDays / 365.25, 1 / 365.25);

    // Convert to price index (for percentage baseline)
    const priceIndex = baseline === 'first'
      ? values
      : values.map(v => v + 1);

    // Total return and CAGR
    const totalReturn = (priceIndex[priceIndex.length - 1] / priceIndex[0]) - 1;
    const cagr = Math.pow(1 + totalReturn, 1 / horizonYears) - 1;

    // Calculate period returns
    const periodReturns: number[] = [];
    for (let i = 1; i < priceIndex.length; i++) {
      periodReturns.push((priceIndex[i] / priceIndex[i - 1]) - 1);
    }

    // Annualized volatility
    const numPeriods = periodReturns.length;
    const freq = numPeriods / horizonYears;
    let annVol = 0;

    if (numPeriods > 1 && freq > 0) {
      const mean = periodReturns.reduce((sum, r) => sum + r, 0) / periodReturns.length;
      const variance = periodReturns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / (periodReturns.length - 1);
      annVol = Math.sqrt(variance) * Math.sqrt(freq);
    }

    // Sharpe ratio (assuming 0 risk-free rate)
    const sharpe = annVol > 0 ? cagr / annVol : 0;

    // Best and worst days
    const bestDay = periodReturns.length > 0 ? Math.max(...periodReturns) : 0;
    const worstDay = periodReturns.length > 0 ? Math.min(...periodReturns) : 0;

    // Max drawdown
    let maxDrawdown = 0;
    let maxDDDate: Date | null = null;
    let peak = priceIndex[0];

    for (let i = 0; i < priceIndex.length; i++) {
      if (priceIndex[i] > peak) {
        peak = priceIndex[i];
      }
      const drawdown = (priceIndex[i] / peak) - 1;
      if (drawdown < maxDrawdown) {
        maxDrawdown = drawdown;
        maxDDDate = normalizedData[i].date;
      }
    }

    metrics.push({
      ticker,
      startPrice,
      endPrice,
      absChange,
      totalReturn,
      cagr,
      annVol,
      sharpe,
      bestDay,
      worstDay,
      maxDrawdown,
      maxDDDate,
    });
  });

  // Sort by total return (descending)
  return metrics.sort((a, b) => b.totalReturn - a.totalReturn);
}
