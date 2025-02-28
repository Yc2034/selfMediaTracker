/**
 * This script initializes sample chart data files if they don't exist.
 * Run it once at setup or after clearing the db directory.
 */

const fs = require('fs');
const path = require('path');

// Ensure db directory exists
const dataDir = path.join(__dirname);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Sample data definitions
const sampleData = {
  pie: {
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
  },
  line: {
    monthlyData: [
      { x: 'Jan', y: 120 },
      { x: 'Feb', y: 140 },
      { x: 'Mar', y: 135 },
      { x: 'Apr', y: 180 },
      { x: 'May', y: 210 },
      { x: 'Jun', y: 240 },
      { x: 'Jul', y: 250 },
      { x: 'Aug', y: 230 },
      { x: 'Sep', y: 220 },
      { x: 'Oct', y: 230 },
      { x: 'Nov', y: 240 },
      { x: 'Dec', y: 270 },
    ],
    quarterlyData: [
      { x: 'Q1', y: 395 },
      { x: 'Q2', y: 630 },
      { x: 'Q3', y: 700 },
      { x: 'Q4', y: 740 },
    ]
  },
  bar: {
    categoryData: [
      { x: '类别A', y: 45 },
      { x: '类别B', y: 65 },
      { x: '类别C', y: 35 },
      { x: '类别D', y: 55 },
      { x: '类别E', y: 25 },
    ]
  }
};

// Create each file if it doesn't exist
for (const [chartType, data] of Object.entries(sampleData)) {
  const filePath = path.join(dataDir, `${chartType}.json`);
  
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Created ${chartType}.json`);
  } else {
    console.log(`${chartType}.json already exists, skipping`);
  }
}

console.log('Database initialization complete!');