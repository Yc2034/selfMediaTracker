import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { NormalizedData, BaselineType } from '../types/stock';
import { format } from 'date-fns';
import { TrendingUp } from 'lucide-react';

interface StockChartProps {
  data: NormalizedData[];
  tickers: string[];
  baseline: BaselineType;
  title?: string;
}

const COLORS = ['#8B5CF6', '#EC4899', '#06B6D4', '#F59E0B', '#10B981', '#EF4444'];

export function StockChart({ data, tickers, baseline, title }: StockChartProps) {
  if (data.length === 0) return null;

  const chartData = data.map(entry => ({
    ...entry,
    date: entry.date.getTime(),
    dateFormatted: format(entry.date, 'MMM dd, yyyy'),
  }));

  const yAxisLabel = baseline === 'first' ? 'Growth vs. Baseline (x)' : 'Cumulative Return (%)';
  const baselineValue = baseline === 'first' ? 1 : 0;

  const formatYAxis = (value: number) => {
    if (baseline === 'first') {
      return value.toFixed(2) + 'x';
    } else {
      return (value * 100).toFixed(0) + '%';
    }
  };

  const formatTooltip = (value: number) => {
    if (baseline === 'first') {
      return value.toFixed(3) + 'x';
    } else {
      return (value * 100).toFixed(2) + '%';
    }
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
        <ResponsiveContainer width="100%" height={500}>
          <LineChart
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
            <YAxis
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
              dataKey={() => baselineValue}
              stroke="rgba(148, 163, 184, 0.5)"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="Baseline"
              legendType="none"
            />

            {/* Stock lines */}
            {tickers.map((ticker, index) => (
              <Line
                key={ticker}
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
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
