export interface StockPrice {
  date: Date;
  close: number;
  volume: number;
}

export interface StockData {
  ticker: string;
  prices: StockPrice[];
}

export interface NormalizedData {
  date: Date;
  [ticker: string]: number | Date;
}

export interface VolumeData {
  date: Date;
  [key: string]: number | Date; // ticker_volume: volume value
}

export interface PerformanceMetrics {
  ticker: string;
  startPrice: number;
  endPrice: number;
  absChange: number;
  totalReturn: number;
  cagr: number;
  annVol: number;
  sharpe: number;
  bestDay: number;
  worstDay: number;
  maxDrawdown: number;
  maxDDDate: Date | null;
}

export type BaselineType = 'first' | 'percentage';
export type IntervalType = '1d' | '1wk' | '1mo';

export interface ChartConfig {
  tickers: string[];
  startDate: string;
  endDate: string;
  interval: IntervalType;
  baseline: BaselineType;
  title?: string;
}
