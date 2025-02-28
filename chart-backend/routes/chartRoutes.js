const express = require('express');
const router = express.Router();
const chartController = require('../controllers/chartController');

// Get all available chart types
router.get('/', chartController.getAllChartTypes);

// Get all data for a specific chart type
router.get('/:chartType', chartController.getChartData);

// Get a specific dataset from a chart type (e.g., pieChartData2 from pie chart data)
router.get('/:chartType/:datasetId', chartController.getDataset);

// Create a new chart type
router.post('/:chartType', chartController.createChartType);

// Update data for a specific chart type
router.put('/:chartType', chartController.updateChartData);

// Update a specific dataset in a chart type
router.put('/:chartType/:datasetId', chartController.updateDataset);

// Delete a chart type
router.delete('/:chartType', chartController.deleteChartType);

module.exports = router;