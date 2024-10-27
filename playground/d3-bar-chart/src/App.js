import React from 'react';
import BarChart from './BarChart';

function App() {
  const data = [12, 36, 6, 25, 35, 10, 24, 30];
  
  return (
    <div className="App">
      <BarChart data={data} />
    </div>
  );
}

export default App;
