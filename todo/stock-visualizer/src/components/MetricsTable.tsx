import type { PerformanceMetrics } from '../types/stock';
import { format } from 'date-fns';

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
    return format(date, 'yyyy-MM-dd');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 overflow-x-auto">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Performance Metrics</h3>

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-800">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider sticky left-0 bg-gray-800">
              Ticker
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
              Start
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
              End
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
              Abs Δ
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
              Total Return
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
              CAGR
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
              Ann Vol
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
              Sharpe
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
              Best Day
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
              Worst Day
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
              Max Drawdown
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
              Max DD Date
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {metrics.map((metric, index) => (
            <tr
              key={metric.ticker}
              className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
            >
              <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-900 sticky left-0 bg-inherit">
                {metric.ticker}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                {formatMoney(metric.startPrice)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                {formatMoney(metric.endPrice)}
              </td>
              <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${
                metric.absChange >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatMoney(metric.absChange)}
              </td>
              <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${
                metric.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatPercent(metric.totalReturn)}
              </td>
              <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${
                metric.cagr >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatPercent(metric.cagr)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                {formatPercent(metric.annVol)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                {formatNumber(metric.sharpe)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-green-600 font-medium">
                {formatPercent(metric.bestDay)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-red-600 font-medium">
                {formatPercent(metric.worstDay)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-red-600 font-medium">
                {formatPercent(metric.maxDrawdown)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                {formatDate(metric.maxDDDate)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 text-sm text-gray-600">
        <p className="mb-1"><strong>Total Return:</strong> Overall percentage gain/loss from start to end</p>
        <p className="mb-1"><strong>CAGR:</strong> Compound Annual Growth Rate</p>
        <p className="mb-1"><strong>Ann Vol:</strong> Annualized Volatility (standard deviation of returns)</p>
        <p className="mb-1"><strong>Sharpe:</strong> Risk-adjusted return (CAGR / Volatility)</p>
        <p className="mb-1"><strong>Max Drawdown:</strong> Largest peak-to-trough decline</p>
      </div>
    </div>
  );
}
