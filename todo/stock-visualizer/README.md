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
- **Backend Proxy**: No CORS issues with included backend server

## Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Recharts** - Interactive charts
- **Lucide React** - Icons
- **Date-fns** - Date formatting

### Backend (included)
- **Node.js** - Runtime
- **Express** - Web server
- **Axios** - HTTP client
- **CORS** - Cross-origin support

## Installation

### Frontend

```bash
cd stock-visualizer
npm install
```

### Backend

```bash
cd stock-visualizer-backend
npm install
```

## Usage

**Important:** You need to run BOTH the frontend and backend for the app to work properly.

### Quick Start (Run Both)

**Terminal 1 - Backend:**
```bash
cd stock-visualizer-backend
npm start
```

Server runs on `http://localhost:3001`

**Terminal 2 - Frontend:**
```bash
cd stock-visualizer
npm run dev
```

App opens at `http://localhost:5173`

### Frontend Only Commands

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Backend Only Commands

```bash
# Start server
npm start

# Development mode with auto-reload
npm run dev

# Health check
curl http://localhost:3001/health
```

## How to Use

1. **Start the Backend**: Make sure the backend server is running on port 3001
2. **Start the Frontend**: Run the React app
3. **Add Stock Tickers**: Enter stock symbols (e.g., AAPL, MSFT, NVDA) and click "Add"
4. **Set Date Range**: Choose start and end dates for the analysis
5. **Select Interval**: Choose daily, weekly, or monthly data points
6. **Choose Baseline Type**:
   - **Growth vs. Baseline**: Shows relative growth (e.g., 2x means doubled)
   - **Cumulative Return**: Shows percentage returns
7. **Add Optional Title**: Customize the chart title
8. **Click "Analyze Performance"**: View the interactive chart and metrics

## Architecture

### Why a Backend?

**CORS Problem:** Browsers block direct API calls from web pages to Yahoo Finance due to Cross-Origin Resource Sharing (CORS) security policies.

**Backend Solution:**
1. Frontend sends requests to backend (same origin ✅)
2. Backend fetches from Yahoo Finance (server-to-server, no CORS ✅)
3. Backend returns data to frontend ✅)

### Data Flow

```
React App → Backend Proxy → Yahoo Finance API
          ←               ←
```

## Configuration

### Custom Backend URL

For production deployment, set the backend URL:

Create `.env` in the frontend directory:
```bash
VITE_API_URL=https://your-deployed-backend.com
```

For local development, it defaults to `http://localhost:3001`.

## Deployment

### Frontend

Deploy to Vercel, Netlify, or any static hosting:

```bash
npm run build
# Upload dist/ folder
```

Set environment variable:
- `VITE_API_URL`: Your deployed backend URL

### Backend

See `../stock-visualizer-backend/README.md` for deployment options (Heroku, Railway, Render, etc.)

## Comparison with Python Version

This React app provides the same functionality as the Python script (`plot_stock_performance.py`) but with these improvements:

| Feature | Python Script | React App |
|---------|--------------|-----------|
| Interface | CLI | Interactive GUI |
| Configuration | Command-line args | Form inputs |
| Interactivity | Static chart | Interactive chart with tooltips |
| Export | PNG/SVG images | CSV data export |
| Deployment | Local Python env | Web browser (anywhere) |
| CORS Issues | None (direct HTTP) | Solved with backend proxy |

## Project Structure

```
stock-visualizer/
├── src/
│   ├── components/         # React components
│   │   ├── StockForm.tsx   # Input form
│   │   ├── StockChart.tsx  # Chart visualization
│   │   └── MetricsTable.tsx # Performance metrics table
│   ├── services/           # API services
│   │   └── stockService.ts # Backend API calls
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

stock-visualizer-backend/
├── server.js               # Express proxy server
├── package.json
└── README.md
```

## Troubleshooting

### "Failed to fetch" Error

Make sure the backend is running:
```bash
cd stock-visualizer-backend
npm start
```

Check health endpoint:
```bash
curl http://localhost:3001/health
```

### Port Already in Use

**Backend (3001):**
```bash
# Find and kill process using port 3001
lsof -ti:3001 | xargs kill -9
```

**Frontend (5173):**
```bash
# Vite will automatically try the next available port
```

## License

MIT

## Contributing

Feel free to submit issues and enhancement requests!
