// Create this file at src/services/chartService.js

const API_URL = 'http://localhost:5050/api';

export const fetchAllChartData = async () => {
  try {
    const response = await fetch(`${API_URL}/chartData`);
    if (!response.ok) {
      throw new Error('Failed to fetch chart data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching chart data:', error);
    throw error;
  }
};

export const fetchChartData = async (chartId) => {
  try {
    const response = await fetch(`${API_URL}/chartData/${chartId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${chartId}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${chartId}:`, error);
    throw error;
  }
};

export const updateChartData = async (chartId, data) => {
  try {
    const response = await fetch(`${API_URL}/chartData/${chartId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update ${chartId}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error updating ${chartId}:`, error);
    throw error;
  }
};