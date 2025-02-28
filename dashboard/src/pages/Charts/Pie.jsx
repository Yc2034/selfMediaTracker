import React, { useState } from 'react';
import { 
  PieChart, 
  Pie as RechartsPie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend,
  Sector
} from 'recharts';
import { pieChartData, pieChartData2 } from '../../data/charts/pieChartData';
import { ChartsHeader } from '../../components';

// Modern vibrant color scheme
const COLORS = ['#6366F1', '#EC4899', '#F59E0B', '#10B981'];

// Custom active shape for hover animation
const renderActiveShape = (props) => {
  const { 
    cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, percent, value 
  } = props;
  
  const sin = Math.sin(-midAngle * Math.PI / 180);
  const cos = Math.cos(-midAngle * Math.PI / 180);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';
  
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        opacity={0.9}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" strokeWidth={2} />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333" fontSize={14} fontWeight="bold">
        {`${payload.x}`}
      </text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999" fontSize={13}>
        {`${value} (${(percent * 100).toFixed(0)}%)`}
      </text>
    </g>
  );
};

// Custom tooltip
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-md shadow-lg border border-gray-200">
        <p className="font-bold text-gray-700">{payload[0].payload.x}</p>
        <p className="text-gray-600">{`人数: ${payload[0].value}`}</p>
        <p className="text-gray-600">{`占比: ${payload[0].payload.text}`}</p>
      </div>
    );
  }
  return null;
};

const Pie = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [chartData, setChartData] = useState(pieChartData);
  
  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };
  
  const switchDataset = () => {
    setChartData(chartData === pieChartData ? pieChartData2 : pieChartData);
    setActiveIndex(0);
  };

  return (
    <div className="m-4 md:m-10 mt-24 p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300">
      <ChartsHeader category="Pie" title={chartData === pieChartData ? "粉丝年龄分布" : "粉丝地域分布"} />
      
      <div className="flex justify-end mb-4">
        <button 
          onClick={switchDataset}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          {chartData === pieChartData ? "查看地域分布" : "查看年龄分布"}
        </button>
      </div>
      
      <div className="w-full h-96">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <RechartsPie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={120}
              dataKey="y"
              onMouseEnter={onPieEnter}
              paddingAngle={2}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                  stroke="#fff"
                  strokeWidth={2}
                />
              ))}
            </RechartsPie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              layout="horizontal" 
              verticalAlign="bottom" 
              align="center"
              formatter={(value, entry, index) => (
                <span className="text-gray-700 dark:text-gray-300 font-medium">{value} ({chartData[index].text})</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {chartData.map((item, index) => (
          <div 
            key={`stat-${index}`} 
            className="p-4 rounded-lg shadow-md text-center hover:shadow-lg cursor-pointer transition-all"
            style={{ backgroundColor: `${COLORS[index]}15`, borderLeft: `4px solid ${COLORS[index]}` }}
            onMouseEnter={() => setActiveIndex(index)}
          >
            <p className="text-gray-600 dark:text-gray-400 text-sm">{item.x}</p>
            <p className="text-2xl font-bold" style={{ color: COLORS[index] }}>{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pie;