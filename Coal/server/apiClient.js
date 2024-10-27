import axios from 'axios';

// Create an Axios instance
const apiClient = axios.create({
  baseURL: 'http://localhost:5000', // Make sure this matches your server
  timeout: 10000, // Optional timeout
});

// Fetch Data Function
export const fetchData = async () => {
  try {
    const response = await apiClient.get('/api/data');
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; // Optional: rethrow the error for further handling
  }
};

// Download Report Function
export const downloadReport = async () => {
  try {
    const response = await apiClient.get('/download-report', {
      responseType: 'blob', // Important for downloading files
    });
    
    // Create a link element for downloading
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'transport_data_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading report:', error);
  }
};
