import type { PerformanceMetrics } from '../types/stock';
import { format } from 'date-fns';
import { TrendingUp, TrendingDown, Activity, Award, AlertTriangle, Calendar } from 'lucide-react';

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
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl shadow-purple-500/20">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
          <Activity className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-white">Performance Metrics</h3>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {metrics.map((metric) => (
          <div
            key={metric.ticker}
            className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 hover:scale-[1.02]"
          >
            {/* Ticker Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
                  <span className="text-white font-bold text-lg">{metric.ticker}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    {metric.totalReturn >= 0 ? (
                      <TrendingUp className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-400" />
                    )}
                    <span className={`text-2xl font-bold ${metric.totalReturn >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {formatPercent(metric.totalReturn)}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">Total Return</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm">CAGR</p>
                <p className={`text-xl font-bold ${metric.cagr >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {formatPercent(metric.cagr)}
                </p>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Price Change */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <p className="text-gray-400 text-xs font-medium">Price Range</p>
                </div>
                <p className="text-white text-sm mb-1">{formatMoney(metric.startPrice)} → {formatMoney(metric.endPrice)}</p>
                <p className={`text-xs font-semibold ${metric.absChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {metric.absChange >= 0 ? '+' : ''}{formatMoney(metric.absChange)}
                </p>
              </div>

              {/* Volatility */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <Activity size={12} className="text-purple-400" />
                  <p className="text-gray-400 text-xs font-medium">Ann. Volatility</p>
                </div>
                <p className="text-white text-lg font-bold">{formatPercent(metric.annVol)}</p>
              </div>

              {/* Sharpe Ratio */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <Award size={12} className="text-yellow-400" />
                  <p className="text-gray-400 text-xs font-medium">Sharpe Ratio</p>
                </div>
                <p className="text-white text-lg font-bold">{formatNumber(metric.sharpe)}</p>
              </div>

              {/* Best Day */}
              <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={12} className="text-emerald-400" />
                  <p className="text-emerald-300 text-xs font-medium">Best Day</p>
                </div>
                <p className="text-emerald-400 text-lg font-bold">{formatPercent(metric.bestDay)}</p>
              </div>

              {/* Worst Day */}
              <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown size={12} className="text-red-400" />
                  <p className="text-red-300 text-xs font-medium">Worst Day</p>
                </div>
                <p className="text-red-400 text-lg font-bold">{formatPercent(metric.worstDay)}</p>
              </div>

              {/* Max Drawdown */}
              <div className="bg-orange-500/10 rounded-xl p-4 border border-orange-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle size={12} className="text-orange-400" />
                  <p className="text-orange-300 text-xs font-medium">Max Drawdown</p>
                </div>
                <p className="text-orange-400 text-lg font-bold">{formatPercent(metric.maxDrawdown)}</p>
              </div>

              {/* Max DD Date */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={12} className="text-cyan-400" />
                  <p className="text-gray-400 text-xs font-medium">Max DD Date</p>
                </div>
                <p className="text-white text-sm font-medium">{formatDate(metric.maxDDDate)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-8 p-6 bg-slate-900/30 rounded-2xl border border-white/5">
        <h4 className="text-white font-semibold mb-4 text-sm">Metric Definitions</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div>
            <p className="text-purple-400 font-medium mb-1">Total Return</p>
            <p className="text-gray-400">Overall percentage gain/loss from start to end</p>
          </div>
          <div>
            <p className="text-purple-400 font-medium mb-1">CAGR</p>
            <p className="text-gray-400">Compound Annual Growth Rate</p>
          </div>
          <div>
            <p className="text-purple-400 font-medium mb-1">Ann. Volatility</p>
            <p className="text-gray-400">Annualized standard deviation of returns</p>
          </div>
          <div>
            <p className="text-purple-400 font-medium mb-1">Sharpe Ratio</p>
            <p className="text-gray-400">Risk-adjusted return (CAGR / Volatility)</p>
          </div>
          <div>
            <p className="text-purple-400 font-medium mb-1">Max Drawdown</p>
            <p className="text-gray-400">Largest peak-to-trough decline</p>
          </div>
          <div>
            <p className="text-purple-400 font-medium mb-1">Best/Worst Day</p>
            <p className="text-gray-400">Single day maximum gain/loss</p>
          </div>
        </div>
      </div>
    </div>
  );
}
