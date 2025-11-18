import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { NormalizedData, BaselineType, StockData } from '../types/stock';
import { format } from 'date-fns';
import { TrendingUp } from 'lucide-react';

interface StockChartProps {
  data: NormalizedData[];
  stockData: StockData[];
  tickers: string[];
  baseline: BaselineType;
  title?: string;
}

const COLORS = ['#8B5CF6', '#EC4899', '#06B6D4', '#F59E0B', '#10B981', '#EF4444'];

export function StockChart({ data, stockData, tickers, baseline, title }: StockChartProps) {
  if (data.length === 0) return null;

  // Merge normalized price data with volume data
  const chartData = data.map(entry => {
    const volumeData: any = { date: entry.date.getTime() };

    // Add volume for each ticker
    stockData.forEach(stock => {
      const priceEntry = stock.prices.find(p => p.date.getTime() === entry.date.getTime());
      if (priceEntry) {
        volumeData[`${stock.ticker}_volume`] = priceEntry.volume;
      }
    });

    return {
      ...entry,
      ...volumeData,
      date: entry.date.getTime(),
      dateFormatted: format(entry.date, 'MMM dd, yyyy'),
    };
  });

  const yAxisLabel = baseline === 'first' ? 'Growth vs. Baseline (x)' : 'Cumulative Return (%)';
  const baselineValue = baseline === 'first' ? 1 : 0;

  const formatYAxis = (value: number) => {
    if (baseline === 'first') {
      return value.toFixed(2) + 'x';
    } else {
      return (value * 100).toFixed(0) + '%';
    }
  };

  const formatTooltip = (value: number, name: string) => {
    if (name.includes('_volume')) {
      // Format volume with K, M, B
      if (value >= 1e9) return (value / 1e9).toFixed(2) + 'B';
      if (value >= 1e6) return (value / 1e6).toFixed(2) + 'M';
      if (value >= 1e3) return (value / 1e3).toFixed(2) + 'K';
      return value.toFixed(0);
    }

    if (baseline === 'first') {
      return value.toFixed(3) + 'x';
    } else {
      return (value * 100).toFixed(2) + '%';
    }
  };

  const formatVolumeAxis = (value: number) => {
    if (value >= 1e9) return (value / 1e9).toFixed(1) + 'B';
    if (value >= 1e6) return (value / 1e6).toFixed(1) + 'M';
    if (value >= 1e3) return (value / 1e3).toFixed(1) + 'K';
    return value.toString();
  };

  const defaultTitle = `Performance Comparison: ${tickers.join(', ')}`;

  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl shadow-purple-500/20 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-white">
          {title || defaultTitle}
        </h3>
      </div>

      <div className="bg-slate-900/50 rounded-2xl p-6 backdrop-blur-sm border border-white/5">
        <ResponsiveContainer width="100%" height={600}>
          <ComposedChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <defs>
              {tickers.map((ticker, index) => (
                <linearGradient key={ticker} id={`gradient-${ticker}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.1}/>
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="date"
              type="number"
              domain={['dataMin', 'dataMax']}
              tickFormatter={(timestamp) => format(new Date(timestamp), 'MMM yy')}
              stroke="rgba(255,255,255,0.5)"
              tick={{ fill: 'rgba(255,255,255,0.7)' }}
            />
            {/* Left Y-Axis for Price */}
            <YAxis
              yAxisId="left"
              tickFormatter={formatYAxis}
              stroke="rgba(255,255,255,0.5)"
              tick={{ fill: 'rgba(255,255,255,0.7)' }}
              label={{
                value: yAxisLabel,
                angle: -90,
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: 'rgba(255,255,255,0.8)', fontWeight: 'bold' },
              }}
            />
            {/* Right Y-Axis for Volume */}
            <YAxis
              yAxisId="right"
              orientation="right"
              tickFormatter={formatVolumeAxis}
              stroke="rgba(255,255,255,0.3)"
              tick={{ fill: 'rgba(255,255,255,0.5)' }}
              label={{
                value: 'Volume',
                angle: 90,
                position: 'insideRight',
                style: { textAnchor: 'middle', fill: 'rgba(255,255,255,0.6)', fontWeight: 'bold' },
              }}
            />
            <Tooltip
              labelFormatter={(timestamp) => format(new Date(timestamp as number), 'MMM dd, yyyy')}
              formatter={formatTooltip}
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '12px',
                backdropFilter: 'blur(12px)',
                color: '#fff',
              }}
              labelStyle={{
                color: 'rgba(255,255,255,0.9)',
                fontWeight: 'bold',
                marginBottom: '8px',
              }}
            />
            <Legend
              wrapperStyle={{
                paddingTop: '20px',
                color: '#fff',
              }}
              iconType="circle"
            />

            {/* Baseline reference line */}
            <Line
              yAxisId="left"
              dataKey={() => baselineValue}
              stroke="rgba(148, 163, 184, 0.5)"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="Baseline"
              legendType="none"
            />

            {/* Stock price lines */}
            {tickers.map((ticker, index) => (
              <Line
                key={ticker}
                yAxisId="left"
                type="monotone"
                dataKey={ticker}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={3}
                dot={false}
                name={ticker}
                animationDuration={1000}
                animationEasing="ease-in-out"
              />
            ))}

            {/* Volume bars */}
            {tickers.map((ticker, index) => (
              <Bar
                key={`${ticker}_volume`}
                yAxisId="right"
                dataKey={`${ticker}_volume`}
                fill={COLORS[index % COLORS.length]}
                opacity={0.3}
                name={`${ticker} Volume`}
                animationDuration={1000}
              />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
