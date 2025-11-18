import { useState } from 'react';
import type { ChartConfig, BaselineType, IntervalType } from '../types/stock';
import { Plus, X } from 'lucide-react';

interface StockFormProps {
  onSubmit: (config: ChartConfig) => void;
  loading: boolean;
}

export function StockForm({ onSubmit, loading }: StockFormProps) {
  const [tickers, setTickers] = useState<string[]>(['AAPL', 'MSFT']);
  const [newTicker, setNewTicker] = useState('');
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 1);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [interval, setInterval] = useState<IntervalType>('1d');
  const [baseline, setBaseline] = useState<BaselineType>('first');
  const [title, setTitle] = useState('');
  const [useSampleData, setUseSampleData] = useState(false);

  const handleAddTicker = () => {
    const trimmed = newTicker.trim().toUpperCase();
    if (trimmed && !tickers.includes(trimmed)) {
      setTickers([...tickers, trimmed]);
      setNewTicker('');
    }
  };

  const handleRemoveTicker = (ticker: string) => {
    setTickers(tickers.filter(t => t !== ticker));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tickers.length === 0) {
      alert('Please add at least one ticker');
      return;
    }
    onSubmit({
      tickers,
      startDate,
      endDate,
      interval,
      baseline,
      title: title || undefined,
      useSampleData,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTicker();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Stock Performance Analyzer</h2>

      {/* Ticker Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Stock Tickers
        </label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newTicker}
            onChange={(e) => setNewTicker(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter ticker (e.g., AAPL)"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="button"
            onClick={handleAddTicker}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tickers.map(ticker => (
            <span
              key={ticker}
              className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
            >
              {ticker}
              <button
                type="button"
                onClick={() => handleRemoveTicker(ticker)}
                className="hover:text-blue-600"
              >
                <X size={16} />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Interval and Baseline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Interval
          </label>
          <select
            value={interval}
            onChange={(e) => setInterval(e.target.value as IntervalType)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="1d">Daily (1d)</option>
            <option value="1wk">Weekly (1wk)</option>
            <option value="1mo">Monthly (1mo)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Baseline Type
          </label>
          <select
            value={baseline}
            onChange={(e) => setBaseline(e.target.value as BaselineType)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="first">Growth vs. Baseline (x)</option>
            <option value="percentage">Cumulative Return (%)</option>
          </select>
        </div>
      </div>

      {/* Title */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Chart Title (Optional)
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Leave empty for auto-generated title"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Loading Data...' : 'Analyze Performance'}
      </button>
    </form>
  );
}
