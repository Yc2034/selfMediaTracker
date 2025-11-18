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

interface StockChartProps {
  data: NormalizedData[];
  tickers: string[];
  baseline: BaselineType;
  title?: string;
}

const COLORS = ['#2E86AB', '#A23B72', '#F18F01', '#C73E1D', '#6A994E', '#BC4B51'];

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
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        {title || defaultTitle}
      </h3>

      <ResponsiveContainer width="100%" height={500}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="date"
            type="number"
            domain={['dataMin', 'dataMax']}
            tickFormatter={(timestamp) => format(new Date(timestamp), 'MMM yy')}
            stroke="#6B7280"
          />
          <YAxis
            tickFormatter={formatYAxis}
            stroke="#6B7280"
            label={{
              value: yAxisLabel,
              angle: -90,
              position: 'insideLeft',
              style: { textAnchor: 'middle', fill: '#374151', fontWeight: 'bold' },
            }}
          />
          <Tooltip
            labelFormatter={(timestamp) => format(new Date(timestamp as number), 'MMM dd, yyyy')}
            formatter={formatTooltip}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              padding: '12px',
            }}
          />
          <Legend
            wrapperStyle={{
              paddingTop: '20px',
            }}
          />

          {/* Baseline reference line */}
          <Line
            dataKey={() => baselineValue}
            stroke="#94A3B8"
            strokeWidth={1}
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
              strokeWidth={2.5}
              dot={false}
              name={ticker}
              animationDuration={500}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
