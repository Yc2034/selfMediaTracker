import type { PerformanceMetrics } from '../types/stock';
import { format } from 'date-fns';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricsTableProps {
  metrics: PerformanceMetrics[];
}

export function MetricsTable({ metrics }: MetricsTableProps) {
  if (metrics.length === 0) return null;

  const formatPercent = (value: number) => {
    return (value * 100).toFixed(2) + '%';
  };

  const formatMoney = (value: number) => {
    return '$' + value.toFixed(2);
  };

  const formatNumber = (value: number) => {
    return value.toFixed(3);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '—';
    return format(date, 'MMM dd, yyyy');
  };

  return (
    <div className="bg-[#1C1C1E] rounded-lg p-6 border border-gray-800">
      <h3 className="text-xl font-semibold text-white mb-6">Performance Metrics</h3>

      <div className="space-y-4">
        {metrics.map((metric) => (
          <div
            key={metric.ticker}
            className="bg-[#2C2C2E] rounded-lg p-5 border border-gray-800"
          >
            {/* Ticker Header */}
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <span className="text-white font-bold text-lg">{metric.ticker}</span>
                <div className="flex items-center gap-1.5">
                  {metric.totalReturn >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-[#00C805]" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-[#FF3B30]" />
                  )}
                  <span className={`text-xl font-semibold ${metric.totalReturn >= 0 ? 'text-[#00C805]' : 'text-[#FF3B30]'}`}>
                    {formatPercent(metric.totalReturn)}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-500 text-xs mb-0.5">CAGR</p>
                <p className={`text-base font-semibold ${metric.cagr >= 0 ? 'text-[#00C805]' : 'text-[#FF3B30]'}`}>
                  {formatPercent(metric.cagr)}
                </p>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Price Change */}
              <div>
                <p className="text-gray-500 text-xs mb-1.5">Price Range</p>
                <p className="text-white text-sm mb-1">{formatMoney(metric.startPrice)} → {formatMoney(metric.endPrice)}</p>
                <p className={`text-xs font-medium ${metric.absChange >= 0 ? 'text-[#00C805]' : 'text-[#FF3B30]'}`}>
                  {metric.absChange >= 0 ? '+' : ''}{formatMoney(metric.absChange)}
                </p>
              </div>

              {/* Volatility */}
              <div>
                <p className="text-gray-500 text-xs mb-1.5">Volatility</p>
                <p className="text-white text-base font-semibold">{formatPercent(metric.annVol)}</p>
              </div>

              {/* Sharpe Ratio */}
              <div>
                <p className="text-gray-500 text-xs mb-1.5">Sharpe</p>
                <p className="text-white text-base font-semibold">{formatNumber(metric.sharpe)}</p>
              </div>

              {/* Best Day */}
              <div>
                <p className="text-gray-500 text-xs mb-1.5">Best Day</p>
                <p className="text-[#00C805] text-base font-semibold">{formatPercent(metric.bestDay)}</p>
              </div>

              {/* Worst Day */}
              <div>
                <p className="text-gray-500 text-xs mb-1.5">Worst Day</p>
                <p className="text-[#FF3B30] text-base font-semibold">{formatPercent(metric.worstDay)}</p>
              </div>

              {/* Max Drawdown */}
              <div>
                <p className="text-gray-500 text-xs mb-1.5">Max Drawdown</p>
                <p className="text-[#FF3B30] text-base font-semibold">{formatPercent(metric.maxDrawdown)}</p>
              </div>

              {/* Max DD Date */}
              <div>
                <p className="text-gray-500 text-xs mb-1.5">Max DD Date</p>
                <p className="text-white text-sm">{formatDate(metric.maxDDDate)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
