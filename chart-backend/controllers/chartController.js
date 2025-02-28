const chartService = require('../services/chartService');

/**
 * Get all available chart types
 */
exports.getAllChartTypes = async (req, res, next) => {
  try {
    const chartTypes = await chartService.getChartTypes();
    res.json(chartTypes);
  } catch (error) {
    next(error);
  }
};

/**
 * Get all data for a specific chart type
 */
exports.getChartData = async (req, res, next) => {
  try {
    const { chartType } = req.params;
    const chartData = await chartService.getChartData(chartType);
    
    if (!chartData) {
      return res.status(404).json({ error: `Chart type '${chartType}' not found` });
    }
    
    res.json(chartData);
  } catch (error) {
    next(error);
  }
};

/**
 * Get a specific dataset from a chart type
 */
exports.getDataset = async (req, res, next) => {
  try {
    const { chartType, datasetId } = req.params;
    const dataset = await chartService.getDataset(chartType, datasetId);
    
    if (!dataset) {
      return res.status(404).json({ error: `Dataset '${datasetId}' not found in chart type '${chartType}'` });
    }
    
    res.json(dataset);
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new chart type
 */
exports.createChartType = async (req, res, next) => {
  try {
    const { chartType } = req.params;
    const chartData = req.body;
    
    const result = await chartService.createChartType(chartType, chartData);
    
    res.status(201).json({ 
      success: true, 
      message: `Chart type '${chartType}' created successfully`, 
      data: result 
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update data for a specific chart type
 */
exports.updateChartData = async (req, res, next) => {
  try {
    const { chartType } = req.params;
    const chartData = req.body;
    
    const result = await chartService.updateChartData(chartType, chartData);
    
    if (!result) {
      return res.status(404).json({ error: `Chart type '${chartType}' not found` });
    }
    
    res.json({ 
      success: true, 
      message: `Chart type '${chartType}' updated successfully` 
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a specific dataset in a chart type
 */
exports.updateDataset = async (req, res, next) => {
  try {
    const { chartType, datasetId } = req.params;
    const datasetData = req.body;
    
    const result = await chartService.updateDataset(chartType, datasetId, datasetData);
    
    if (!result) {
      return res.status(404).json({ 
        error: `Dataset '${datasetId}' not found in chart type '${chartType}'` 
      });
    }
    
    res.json({ 
      success: true, 
      message: `Dataset '${datasetId}' in chart type '${chartType}' updated successfully` 
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a chart type
 */
exports.deleteChartType = async (req, res, next) => {
  try {
    const { chartType } = req.params;
    
    const result = await chartService.deleteChartType(chartType);
    
    if (!result) {
      return res.status(404).json({ error: `Chart type '${chartType}' not found` });
    }
    
    res.json({ 
      success: true, 
      message: `Chart type '${chartType}' deleted successfully` 
    });
  } catch (error) {
    next(error);
  }
};