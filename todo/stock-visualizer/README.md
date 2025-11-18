# Stock Performance Visualizer

A modern, interactive web application built with React, TypeScript, and TailwindCSS to visualize and analyze stock performance. This is a GUI version of the Python stock plotter script.

## Features

- **Interactive GUI**: Easy-to-use form for configuring stock analysis
- **Multiple Stock Comparison**: Compare performance of multiple stocks on a single chart
- **Customizable Options**:
  - Date range selection
  - Interval options (daily, weekly, monthly)
  - Baseline types (growth multiplier or cumulative return)
  - Custom chart titles
- **Performance Metrics**: Comprehensive table showing:
  - Total Return & CAGR
  - Annualized Volatility
  - Sharpe Ratio
  - Best/Worst Days
  - Maximum Drawdown
- **Data Export**: Download chart data as CSV
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Recharts** - Interactive charts
- **Lucide React** - Icons
- **Date-fns** - Date formatting

## Installation

```bash
cd stock-visualizer
npm install
```

## Usage

### Development Mode

```bash
npm run dev
```

Then open http://localhost:5173 in your browser.

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## How to Use

1. **Add Stock Tickers**: Enter stock symbols (e.g., AAPL, MSFT, NVDA) and click "Add"
2. **Set Date Range**: Choose start and end dates for the analysis
3. **Select Interval**: Choose daily, weekly, or monthly data points
4. **Choose Baseline Type**:
   - **Growth vs. Baseline**: Shows relative growth (e.g., 2x means doubled)
   - **Cumulative Return**: Shows percentage returns
5. **Add Optional Title**: Customize the chart title
6. **Click "Analyze Performance"**: View the interactive chart and metrics

## Data Source

Stock data is fetched from the Yahoo Finance API. Note that due to CORS restrictions in some browsers, you may need to:
- Run the app through a backend proxy
- Use browser extensions to bypass CORS
- Deploy the app to a server with proper CORS handling

## Comparison with Python Version

This React app provides the same functionality as the Python script (`plot_stock_performance.py`) but with these improvements:

| Feature | Python Script | React App |
|---------|--------------|-----------|
| Interface | CLI | Interactive GUI |
| Configuration | Command-line args | Form inputs |
| Interactivity | Static chart | Interactive chart with tooltips |
| Export | PNG/SVG images | CSV data export |
| Deployment | Local Python env | Web browser (anywhere) |

## Project Structure

```
stock-visualizer/
├── src/
│   ├── components/         # React components
│   │   ├── StockForm.tsx   # Input form
│   │   ├── StockChart.tsx  # Chart visualization
│   │   └── MetricsTable.tsx # Performance metrics table
│   ├── services/           # API services
│   │   └── stockService.ts # Yahoo Finance data fetching
│   ├── types/              # TypeScript types
│   │   └── stock.ts        # Type definitions
│   ├── utils/              # Utilities
│   │   └── dataProcessing.ts # Data normalization & metrics
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## License

MIT

## Contributing

Feel free to submit issues and enhancement requests!
