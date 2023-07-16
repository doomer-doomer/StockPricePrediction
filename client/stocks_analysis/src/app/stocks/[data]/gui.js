import React from 'react';

const CustomGUI = ({ chart }) => {
  const toggleSeries = () => {
    const series = chart.series[0]; // Assuming you want to toggle the first series
    if (series.visible) {
      series.hide();
    } else {
      series.show();
    }
  };

  return (
    <div>
      <button onClick={toggleSeries}>Toggle Series</button>
    </div>
  );
};

export default CustomGUI;
