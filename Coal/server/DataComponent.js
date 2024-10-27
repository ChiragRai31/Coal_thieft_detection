import React, { useEffect, useState } from 'react';
import { fetchData, downloadReport } from './apiService'; // Adjust path as necessary

const DataComponent = () => {
  const [data, setData] = useState([]);

  const loadData = async () => {
    try {
      const fetchedData = await fetchData();
      setData(fetchedData);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div>
      <h1>Data</h1>
      <button onClick={downloadReport}>Download Report</button>
      <ul>
        {data.map((item, index) => (
          <li key={index}>{JSON.stringify(item)}</li>
        ))}
      </ul>
    </div>
  );
};

export default DataComponent;
