
export const colorMappingData = [
  [
    { x: 'Jan', y: -3.5 },
    { x: 'Feb', y: -3.5 },
    { x: 'Mar', y: 1.5 },
    { x: 'Apr', y: 8 },
    { x: 'May', y: 14.5 },
    { x: 'June', y: 19.5 },
    { x: 'July', y: 22.5 },
    { x: 'Aug', y: 22 },
    { x: 'Sep', y: 18.5 },
    { x: 'Oct', y: 11.5 },
    { x: 'Nov', y: 5.5 },
    { x: 'Dec', y: 0 },
  ],
  ['#FF4040'],
  ['#FFA500'],
  ['#FFFF99'],
  ['#80FF00'],
];

export const rangeColorMapping = [
  { label: '-10°C to 0°C',
      start: '-10',
      end: '0',
      colors: colorMappingData[1] },

  { label: '1°C to 10°C',
    start: '1',
    end: '10',
    colors: colorMappingData[2] },

  { label: '11°C to 20°C',
    start: '11',
    end: '20',
    colors: colorMappingData[3] },

  { label: '21°C to 30°C',
    start: '21',
    end: '30',
    colors: colorMappingData[4] },

];

export const ColorMappingPrimaryXAxis = {
  valueType: 'Category',
  majorGridLines: { width: 0 },
  title: 'Months',
};

export const ColorMappingPrimaryYAxis = {
  lineStyle: { width: 0 },
  majorTickLines: { width: 0 },
  minorTickLines: { width: 0 },
  labelFormat: '{value}°C',
  title: 'Temperature',
};
