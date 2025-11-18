import { useState } from 'react';
import type { ChartConfig, BaselineType, IntervalType } from '../types/stock';
import { Plus, X, Calendar, TrendingUp } from 'lucide-react';

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
    <form onSubmit={handleSubmit} className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl shadow-purple-500/20 mb-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">Configure Analysis</h2>
      </div>

      {/* Ticker Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Stock Tickers
        </label>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newTicker}
            onChange={(e) => setNewTicker(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter ticker (e.g., NVDA)"
            className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
          <button
            type="button"
            onClick={handleAddTicker}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-medium rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg shadow-purple-500/50 hover:scale-105"
          >
            <Plus size={20} />
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tickers.map(ticker => (
            <span
              key={ticker}
              className="group inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-200 rounded-xl text-sm font-semibold backdrop-blur-sm hover:from-purple-500/30 hover:to-pink-500/30 transition-all"
            >
              {ticker}
              <button
                type="button"
                onClick={() => handleRemoveTicker(ticker)}
                className="hover:text-pink-400 transition-colors"
              >
                <X size={16} />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
            <Calendar size={16} className="text-purple-400" />
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
            <Calendar size={16} className="text-purple-400" />
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Interval and Baseline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Interval
          </label>
          <select
            value={interval}
            onChange={(e) => setInterval(e.target.value as IntervalType)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none cursor-pointer"
          >
            <option value="1d" className="bg-slate-800">Daily (1d)</option>
            <option value="1wk" className="bg-slate-800">Weekly (1wk)</option>
            <option value="1mo" className="bg-slate-800">Monthly (1mo)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Baseline Type
          </label>
          <select
            value={baseline}
            onChange={(e) => setBaseline(e.target.value as BaselineType)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none cursor-pointer"
          >
            <option value="first" className="bg-slate-800">Growth vs. Baseline (x)</option>
            <option value="percentage" className="bg-slate-800">Cumulative Return (%)</option>
          </select>
        </div>
      </div>

      {/* Title */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Chart Title (Optional)
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Leave empty for auto-generated title"
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 hover:from-purple-600 hover:via-pink-600 hover:to-purple-700 text-white font-bold text-lg rounded-xl shadow-2xl shadow-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-3">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Loading Data...
          </span>
        ) : (
          'Analyze Performance'
        )}
      </button>
    </form>
  );
}
