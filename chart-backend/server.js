const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(cors());
app.use(express.json());

// Data file path
const dataFilePath = path.join(__dirname, 'db', 'chartData.json');

// Ensure the db directory exists
if (!fs.existsSync(path.join(__dirname, 'db'))) {
  fs.mkdirSync(path.join(__dirname, 'db'));
}

// Initialize the data file if it doesn't exist
if (!fs.existsSync(dataFilePath)) {
  const initialData = {
    pieChartData: [
      { x: '小于18', y: 40, text: '40%' },
      { x: '19到24', y: 29, text: '29%' },
      { x: '25到30', y: 16, text: '16%' },
      { x: '30以上', y: 15, text: '15%' },
    ],
    pieChartData2: [
      { x: '一线', y: 33, text: '33%' },
      { x: '二三线', y: 38, text: '38%' },
      { x: '四五线', y: 25, text: '25%' },
      { x: '海外', y: 4, text: '4%' },
    ]
  };
  
  fs.writeFileSync(dataFilePath, JSON.stringify(initialData, null, 2));
}

// Get all chart data
app.get('/api/chartData', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
    res.json(data);
  } catch (error) {
    console.error('Error reading chart data:', error);
    res.status(500).json({ error: 'Failed to fetch chart data' });
  }
});

// Get specific chart data
app.get('/api/chartData/:chartId', (req, res) => {
  try {
    const { chartId } = req.params;
    const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
    
    if (data[chartId]) {
      res.json(data[chartId]);
    } else {
      res.status(404).json({ error: 'Chart data not found' });
    }
  } catch (error) {
    console.error('Error reading chart data:', error);
    res.status(500).json({ error: 'Failed to fetch chart data' });
  }
});

// Update chart data
app.put('/api/chartData/:chartId', (req, res) => {
  try {
    const { chartId } = req.params;
    const newData = req.body;
    
    const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
    
    data[chartId] = newData;
    
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    
    res.json({ success: true, message: `${chartId} updated successfully` });
  } catch (error) {
    console.error('Error updating chart data:', error);
    res.status(500).json({ error: 'Failed to update chart data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});