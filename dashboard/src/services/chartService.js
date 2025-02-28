// src/services/chartService.js

const API_URL = 'http://localhost:5050/api/charts';

/**
 * Get all available chart types
 */
export const getChartTypes = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch chart types');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching chart types:', error);
    throw error;
  }
};

/**
 * Get all data for a specific chart type (e.g., 'pie', 'line')
 */
export const getChartData = async (chartType) => {
  try {
    const response = await fetch(`${API_URL}/${chartType}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${chartType} data`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${chartType} data:`, error);
    throw error;
  }
};

/**
 * Get a specific dataset from a chart type (e.g., 'pieChartData2' from 'pie')
 */
export const getDataset = async (chartType, datasetId) => {
  try {
    const response = await fetch(`${API_URL}/${chartType}/${datasetId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${datasetId} from ${chartType}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${datasetId} from ${chartType}:`, error);
    throw error;
  }
};

/**
 * Create a new chart type
 */
export const createChartType = async (chartType, data) => {
  try {
    const response = await fetch(`${API_URL}/${chartType}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create ${chartType}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error creating ${chartType}:`, error);
    throw error;
  }
};

/**
 * Update data for a specific chart type
 */
export const updateChartData = async (chartType, data) => {
  try {
    const response = await fetch(`${API_URL}/${chartType}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update ${chartType}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error updating ${chartType}:`, error);
    throw error;
  }
};

/**
 * Update a specific dataset in a chart type
 */
export const updateDataset = async (chartType, datasetId, data) => {
  try {
    const response = await fetch(`${API_URL}/${chartType}/${datasetId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update ${datasetId} in ${chartType}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error updating ${datasetId} in ${chartType}:`, error);
    throw error;
  }
};

/**
 * Delete a chart type
 */
export const deleteChartType = async (chartType) => {
  try {
    const response = await fetch(`${API_URL}/${chartType}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete ${chartType}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error deleting ${chartType}:`, error);
    throw error;
  }
};