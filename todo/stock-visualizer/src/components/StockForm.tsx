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
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTicker();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#1C1C1E] rounded-lg p-6 mb-6 border border-gray-800">
      <h2 className="text-xl font-semibold text-white mb-6">Analysis Parameters</h2>

      {/* Ticker Input */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Stocks
        </label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newTicker}
            onChange={(e) => setNewTicker(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add ticker"
            className="flex-1 px-3 py-2.5 bg-[#2C2C2E] border-0 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-600"
          />
          <button
            type="button"
            onClick={handleAddTicker}
            className="px-5 py-2.5 bg-[#00C805] hover:bg-[#00B004] text-white font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus size={18} />
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tickers.map(ticker => (
            <span
              key={ticker}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#2C2C2E] text-white rounded-md text-sm font-medium"
            >
              {ticker}
              <button
                type="button"
                onClick={() => handleRemoveTicker(ticker)}
                className="hover:text-gray-400 transition-colors"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2.5 bg-[#2C2C2E] border-0 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-gray-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2.5 bg-[#2C2C2E] border-0 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-gray-600"
          />
        </div>
      </div>

      {/* Interval and Baseline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Interval
          </label>
          <select
            value={interval}
            onChange={(e) => setInterval(e.target.value as IntervalType)}
            className="w-full px-3 py-2.5 bg-[#2C2C2E] border-0 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-gray-600 appearance-none cursor-pointer"
          >
            <option value="1d" className="bg-[#2C2C2E]">Daily</option>
            <option value="1wk" className="bg-[#2C2C2E]">Weekly</option>
            <option value="1mo" className="bg-[#2C2C2E]">Monthly</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Baseline
          </label>
          <select
            value={baseline}
            onChange={(e) => setBaseline(e.target.value as BaselineType)}
            className="w-full px-3 py-2.5 bg-[#2C2C2E] border-0 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-gray-600 appearance-none cursor-pointer"
          >
            <option value="first" className="bg-[#2C2C2E]">Growth (x)</option>
            <option value="percentage" className="bg-[#2C2C2E]">Return (%)</option>
          </select>
        </div>
      </div>

      {/* Title */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Chart Title <span className="text-gray-600">(Optional)</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Auto-generated if empty"
          className="w-full px-3 py-2.5 bg-[#2C2C2E] border-0 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-600"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-3.5 bg-[#00C805] hover:bg-[#00B004] text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Loading...
          </span>
        ) : (
          'Analyze'
        )}
      </button>
    </form>
  );
}
