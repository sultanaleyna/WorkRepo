import React, { useEffect, useState } from 'react';
import { getToken, getData } from './DataService';
import 'bootstrap/dist/css/bootstrap.min.css';

const DataDisplay = () => {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      const token = await getToken();
      if (token) {
        const fetchedData = await getData(token);
        setData(fetchedData);
      }
    };
    fetchData();
  }, []);
  
  const renderData = () => {
    // Verileri tablo şeklinde göstermek için düzenleyeceğiz.
    return data.map((item, index) => (
      <tr key={index}>
        <td>{item.field1}</td>
        <td>{item.field2}</td>
        <td>{item.field3}</td>
        {/* Diğer alanlar */}
      </tr>
    ));
  };
  
  return (
  <div>
      <h1>hesapKodu- toplamBorc</h1>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Field 1</th>
            <th>Field 2</th>
            <th>Field 3</th>
            {/* Diğer başlıklar */}
          </tr>
        </thead>
        <tbody>
          {renderData()}
        </tbody>
      </table>
    </div>
  );
};

export default DataDisplay;