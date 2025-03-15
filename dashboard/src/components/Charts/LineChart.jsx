import React from 'react';
import { ChartComponent, SeriesCollectionDirective, SeriesDirective, Inject, LineSeries, DateTime, Legend, Tooltip, Zoom, Crosshair } from '@syncfusion/ej2-react-charts';

import { lineCustomSeries, LinePrimaryXAxis, LinePrimaryYAxis } from '../../data/charts/lineChartData';
import { useStateContext } from '../../contexts/ContextProvider';

const LineChart = () => {
  const { currentMode } = useStateContext();

  return (
    <ChartComponent
      id="line-chart"
      height="420px"
      width="100%"
      primaryXAxis={LinePrimaryXAxis}
      primaryYAxis={LinePrimaryYAxis}
      chartArea={{ border: { width: 0 } }}
      tooltip={{ enable: true, shared: true }}
      crosshair={{ enable: true, lineType: 'Vertical', line: { width: 1 } }}
      background={currentMode === 'Dark' ? '#33373E' : '#fff'}
      legendSettings={{ 
        background: currentMode === 'Dark' ? '#33373E' : '#fff',
        textStyle: { color: currentMode === 'Dark' ? '#fff' : '#33373E' },
        visible: true,
        position: 'Top'
      }}
      palettes={currentMode === 'Dark' ? ['#4ade80', '#06b6d4', '#8b5cf6', '#f43f5e'] : undefined}
      title="Revenue Analysis"
      titleStyle={{ 
        fontWeight: 'bold', 
        color: currentMode === 'Dark' ? '#fff' : '#33373E',
        textAlignment: 'Center',
        size: '18px'
      }}
      margin={{ left: 15, right: 15, top: 35, bottom: 15 }}
      zoomSettings={{ 
        enableSelectionZooming: true,
        enablePan: true,
        enableMouseWheelZooming: true,
        enablePinchZooming: true,
        enableScrollbar: true
      }}
      theme={currentMode === 'Dark' ? 'Dark' : 'Material'}
    >
      <Inject services={[LineSeries, DateTime, Legend, Tooltip, Zoom, Crosshair]} />
      <SeriesCollectionDirective>
        {lineCustomSeries.map((item, index) => (
          <SeriesDirective 
            key={index} 
            {...item} 
            animation={{ enable: true }}
            marker={{ 
              visible: true,
              height: 7,
              width: 7,
              shape: 'Circle',
              fill: item.color
            }}
            type="Line"
            width={2}
          />
        ))}
      </SeriesCollectionDirective>
    </ChartComponent>
  );
};

export default LineChart;