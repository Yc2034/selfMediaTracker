const fs = require('fs').promises;
const path = require('path');

// Data directory path
const dataDir = path.join(__dirname, '..', 'db');

/**
 * Get list of all available chart types
 */
exports.getChartTypes = async () => {
  try {
    const files = await fs.readdir(dataDir);
    
    // Filter for JSON files and remove extension
    return files
      .filter(file => file.endsWith('.json'))
      .map(file => file.replace('.json', ''));
  } catch (error) {
    console.error('Error getting chart types:', error);
    throw new Error('Failed to retrieve chart types');
  }
};

/**
 * Get data for a specific chart type
 */
exports.getChartData = async (chartType) => {
  try {
    const filePath = path.join(dataDir, `${chartType}.json`);
    
    try {
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (err) {
      if (err.code === 'ENOENT') {
        return null; // File doesn't exist
      }
      throw err;
    }
  } catch (error) {
    console.error(`Error getting ${chartType} data:`, error);
    throw new Error(`Failed to retrieve ${chartType} data`);
  }
};

/**
 * Get a specific dataset from a chart type
 */
exports.getDataset = async (chartType, datasetId) => {
  try {
    const chartData = await exports.getChartData(chartType);
    
    if (!chartData || !chartData[datasetId]) {
      return null;
    }
    
    return chartData[datasetId];
  } catch (error) {
    console.error(`Error getting dataset ${datasetId} from ${chartType}:`, error);
    throw new Error(`Failed to retrieve dataset ${datasetId} from ${chartType}`);
  }
};

/**
 * Create a new chart type
 */
exports.createChartType = async (chartType, data) => {
  try {
    const filePath = path.join(dataDir, `${chartType}.json`);
    
    // Check if file already exists
    try {
      await fs.access(filePath);
      throw new Error(`Chart type '${chartType}' already exists`);
    } catch (err) {
      // If file doesn't exist, we can create it
      if (err.code !== 'ENOENT') {
        throw err;
      }
    }
    
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error(`Error creating chart type ${chartType}:`, error);
    throw new Error(`Failed to create chart type ${chartType}`);
  }
};

/**
 * Update data for a specific chart type
 */
exports.updateChartData = async (chartType, data) => {
  try {
    const filePath = path.join(dataDir, `${chartType}.json`);
    
    // Check if file exists
    try {
      await fs.access(filePath);
    } catch (err) {
      if (err.code === 'ENOENT') {
        return null; // File doesn't exist
      }
      throw err;
    }
    
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error updating ${chartType} data:`, error);
    throw new Error(`Failed to update ${chartType} data`);
  }
};

/**
 * Update a specific dataset in a chart type
 */
exports.updateDataset = async (chartType, datasetId, datasetData) => {
  try {
    const chartData = await exports.getChartData(chartType);
    
    if (!chartData) {
      return null;
    }
    
    // Update the specific dataset
    chartData[datasetId] = datasetData;
    
    // Write the updated data back to the file
    const filePath = path.join(dataDir, `${chartType}.json`);
    await fs.writeFile(filePath, JSON.stringify(chartData, null, 2));
    
    return true;
  } catch (error) {
    console.error(`Error updating dataset ${datasetId} in ${chartType}:`, error);
    throw new Error(`Failed to update dataset ${datasetId} in ${chartType}`);
  }
};

/**
 * Delete a chart type
 */
exports.deleteChartType = async (chartType) => {
  try {
    const filePath = path.join(dataDir, `${chartType}.json`);
    
    try {
      await fs.access(filePath);
    } catch (err) {
      if (err.code === 'ENOENT') {
        return null; // File doesn't exist
      }
      throw err;
    }
    
    await fs.unlink(filePath);
    return true;
  } catch (error) {
    console.error(`Error deleting chart type ${chartType}:`, error);
    throw new Error(`Failed to delete chart type ${chartType}`);
  }
};