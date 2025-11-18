import { useState } from 'react';
import { StockForm } from './components/StockForm';
import { StockChart } from './components/StockChart';
import { MetricsTable } from './components/MetricsTable';
import type { ChartConfig, NormalizedData, PerformanceMetrics } from './types/stock';
import { fetchMultipleStocks } from './services/stockService';
import { normalizePrices, calculateMetrics } from './utils/dataProcessing';
import { Download, AlertCircle, TrendingUp, BarChart3 } from 'lucide-react';

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<ChartConfig | null>(null);
  const [normalizedData, setNormalizedData] = useState<NormalizedData[]>([]);
  const [metrics, setMetrics] = useState<PerformanceMetrics[]>([]);

  const handleSubmit = async (chartConfig: ChartConfig) => {
    setLoading(true);
    setError(null);
    setConfig(chartConfig);

    try {
      const startDate = new Date(chartConfig.startDate);
      const endDate = new Date(chartConfig.endDate);

      const data = await fetchMultipleStocks(
        chartConfig.tickers,
        startDate,
        endDate,
        chartConfig.interval
      );

      const normalized = normalizePrices(data, chartConfig.baseline);
      const performanceMetrics = calculateMetrics(data, normalized, chartConfig.baseline);

      setNormalizedData(normalized);
      setMetrics(performanceMetrics);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stock data');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportChart = () => {
    if (normalizedData.length === 0) return;

    const headers = ['Date', ...config!.tickers];
    const rows = normalizedData.map(entry => {
      const row = [entry.date.toISOString()];
      config!.tickers.forEach(ticker => {
        row.push((entry[ticker] as number).toString());
      });
      return row.join(',');
    });

    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stock-performance-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl shadow-lg shadow-purple-500/50">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 mb-4 tracking-tight">
              Stock Performance Visualizer
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Analyze and compare stock performance with interactive charts and comprehensive metrics
            </p>
          </div>

          <div className="max-w-7xl mx-auto space-y-6">
            <StockForm onSubmit={handleSubmit} loading={loading} />

            {/* Error State */}
            {error && (
              <div className="backdrop-blur-md bg-red-500/10 border border-red-500/20 rounded-2xl p-6 animate-slide-up">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-red-500/20 rounded-lg">
                    <AlertCircle className="text-red-400" size={24} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-red-300 font-semibold text-lg mb-2">Error Loading Data</h4>
                    <p className="text-red-200/80 text-sm leading-relaxed">{error}</p>
                    <p className="text-red-300/60 text-xs mt-3">
                      Make sure the backend server is running on port 3001
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-12 text-center animate-slide-up">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
                    <BarChart3 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-purple-400" size={24} />
                  </div>
                  <p className="text-gray-300 font-medium text-lg">Fetching market data...</p>
                  <p className="text-gray-400 text-sm">Analyzing {config?.tickers.join(', ')}</p>
                </div>
              </div>
            )}

            {/* Results */}
            {!loading && normalizedData.length > 0 && config && (
              <div className="space-y-6 animate-slide-up">
                {/* Export Button */}
                <div className="flex justify-end">
                  <button
                    onClick={handleExportChart}
                    className="group px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/50 transition-all duration-300 flex items-center gap-2 hover:scale-105"
                  >
                    <Download size={20} className="group-hover:animate-bounce" />
                    Export Data (CSV)
                  </button>
                </div>

                <StockChart
                  data={normalizedData}
                  tickers={config.tickers}
                  baseline={config.baseline}
                  title={config.title}
                />

                <MetricsTable metrics={metrics} />
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && normalizedData.length === 0 && (
              <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-16 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 bg-purple-500/20 rounded-2xl">
                    <BarChart3 className="w-12 h-12 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-200">Ready to analyze</h3>
                  <p className="text-gray-400 max-w-md">
                    Enter stock tickers and configure your analysis parameters above to get started
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <footer className="mt-20 text-center text-gray-500 text-sm space-y-2">
            <p className="text-gray-400">Data provided by Yahoo Finance API</p>
            <p className="text-gray-500">Built with React, TypeScript, TailwindCSS & Recharts</p>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default App;
