import { useState } from 'react';
import { StockForm } from './components/StockForm';
import { StockChart } from './components/StockChart';
import { MetricsTable } from './components/MetricsTable';
import type { ChartConfig, NormalizedData, PerformanceMetrics } from './types/stock';
import { fetchMultipleStocks } from './services/stockService';
import { normalizePrices, calculateMetrics } from './utils/dataProcessing';
import { Download, AlertCircle } from 'lucide-react';

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

      // Fetch stock data
      const data = await fetchMultipleStocks(
        chartConfig.tickers,
        startDate,
        endDate,
        chartConfig.interval
      );

      // Process data
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
    // Create a simple CSV export of the data
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Stock Performance Visualizer
          </h1>
          <p className="text-gray-600">
            Analyze and compare stock performance with interactive charts and metrics
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <StockForm onSubmit={handleSubmit} loading={loading} />

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="text-red-800 font-semibold mb-1">Error Loading Data</h4>
                <p className="text-red-700 text-sm">{error}</p>
                <p className="text-red-600 text-xs mt-2">
                  Note: Due to CORS restrictions, direct Yahoo Finance API calls may be blocked.
                  Consider using a backend proxy or the sample data feature.
                </p>
              </div>
            </div>
          )}

          {loading && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
              <p className="text-blue-800 font-medium">Loading stock data...</p>
            </div>
          )}

          {!loading && normalizedData.length > 0 && config && (
            <>
              <div className="mb-4 flex justify-end">
                <button
                  onClick={handleExportChart}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Download size={20} />
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
            </>
          )}

          {!loading && !error && normalizedData.length === 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-600">
                Enter stock tickers and date range above to start analyzing performance
              </p>
            </div>
          )}
        </div>

        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>Data provided by Yahoo Finance API</p>
          <p className="mt-1">Built with React, TypeScript, TailwindCSS, and Recharts</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
