
export const lineChartData = [
  [
    { x: new Date(2021, 1, 27), y: 100 },
    { x: new Date(2021, 2, 5), y: 1000 },
    { x: new Date(2021, 2, 22), y: 3000 },
    { x: new Date(2021, 3, 21), y: 5000 },
    { x: new Date(2021, 5, 28), y: 10000 },
    { x: new Date(2021, 8, 1), y: 20000 },
    { x: new Date(2022, 9, 3), y: 30000 },
  ],
  [
    { x: new Date(2021, 1, 27), y: 100 },
    { x: new Date(2021, 2, 5), y: 150 },
    { x: new Date(2021, 2, 22), y: 220 },
    { x: new Date(2021, 3, 21), y: 250 },
    { x: new Date(2021, 5, 28), y: 400 },
    { x: new Date(2021, 8, 1), y: 450 },
    { x: new Date(2022, 9, 3), y: 3500 },
  ],


];



export const lineCustomSeries = [
  { dataSource: lineChartData[0],
    xName: 'x',
    yName: 'y',
    name: '小红书',
    width: '2',
    marker: { visible: true, width: 10, height: 10 },
    type: 'Line' },

  { dataSource: lineChartData[1],
    xName: 'x',
    yName: 'y',
    name: '抖音',
    width: '2',
    marker: { visible: true, width: 10, height: 10 },
    type: 'Line' },

];

export const LinePrimaryXAxis = {
  valueType: 'DateTime',
  labelFormat: 'yMM',
  intervalType: 'Auto',
  edgeLabelPlacement: 'Shift',
  majorGridLines: { width: 0 },
  background: 'white',
};

export const LinePrimaryYAxis = {
  labelFormat: '粉丝数 {value} ',
  rangePadding: 'None',
  minimum: 0,

  interval: 5000,
  lineStyle: { width: 0 },
  majorTickLines: { width: 0 },
  minorTickLines: { width: 0 },
};
