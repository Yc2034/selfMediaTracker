import React from 'react';
import { BsSignpostSplit } from 'react-icons/bs';
import { IoIosMore } from 'react-icons/io';
import {  Pie, Button, LineChart, SparkLine } from '../components';

import { pieChartData, pieChartData2}  from '../data/charts/pieChartData';
import { useStateContext } from '../contexts/ContextProvider';
import { fansData, weekReportHighlight } from '../data/vlogger/fansdashboard';

import product9 from '../assets/articleheadpic.jpg';
import { RedFans,DouyinFans, SparklineAreaData, weeklyStats } from '../data/vlogger/fansdashboard';


const Ecommerce = () => {
  const { currentColor, currentMode } = useStateContext();

  return (
    <div className="mt-24">
      <div className="flex flex-wrap lg:flex-nowrap justify-center ">
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-44 rounded-xl w-full lg:w-80 p-8 pt-9 m-3 bg-hero-pattern bg-no-repeat bg-cover bg-center">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold text-gray-400">小红书粉丝</p>
              <p className="text-2xl">{RedFans}</p>
              <p className="font-bold text-gray-400">抖音粉丝</p>
              <p className="text-2xl">{DouyinFans}</p>
            </div>
            <button
              type="button"
              style={{ backgroundColor: currentColor }}
              className="text-2xl opacity-0.9 text-white hover:drop-shadow-xl rounded-full  p-4"
            >
              <BsSignpostSplit />
            </button>
          </div>
 
        </div>
        <div className="flex m-3 flex-wrap justify-center gap-1 items-center">
          {fansData.map((item) => (
            <div key={item.title} className="bg-white h-44 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56  p-4 pt-9 rounded-2xl ">
              <button
                type="button"
                style={{ color: item.iconColor, backgroundColor: item.iconBg }}
                className="text-2xl opacity-0.9 rounded-full  p-4 hover:drop-shadow-xl"
              >
                {item.icon}
              </button>
              <p className="mt-3">
                <span className="text-lg font-semibold">{item.amount}</span>
                <span className={`text-sm text-${item.pcColor} ml-2`}>
                  {item.percentage}
                </span>
              </p>
              <p className="text-sm text-gray-400  mt-1">{item.title}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-10 flex-wrap items-center justify-center">
     
        <div>
          <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-b-2xl md:w-400 p-4 m-6 flex items-center gap-10">
            <div>
              <p className="text-gray-400">小红书</p>
            </div>

            <div className="w-40">
              <Pie id="pie-chart" data={pieChartData} legendVisiblity={false} height="160px" />
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-b-2xl md:w-400 p-4 m-6 flex items-center gap-10">
            <div>
              <p className="text-2xl font-semibold ">粉丝城市</p>
              <p className="text-gray-400">小红书</p>
            </div>

            <div className="w-40">
              <Pie id="pie-chart2" data={pieChartData2} legendVisiblity={false} height="160px" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-10 m-4 flex-wrap justify-center">
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl">
          <div className="flex justify-between items-center gap-2">
            <p className="text-xl font-semibold">笔记亮点</p>
          </div>
          <div className="mt-10 w-72 md:w-400">
            {weekReportHighlight.map((item) => (
              <div key={item.title} className="flex justify-between mt-4">
                <div className="flex gap-4">
                  <button
                    type="button"
                    style={{
                      color: item.iconColor,
                      backgroundColor: item.iconBg,
                    }}
                    className="text-2xl rounded-lg p-4 hover:drop-shadow-xl"
                  >
                    {item.icon}
                  </button>
                  <div>
                    <p className="text-md font-semibold">{item.title}</p>
                    <p className="text-sm text-gray-400">{item.desc}</p>
                  </div>
                </div>
                <p className={`text-${item.pcColor}`}>{item.amount}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl w-96 md:w-760">
          <div className="flex justify-between items-center gap-2 mb-10">
            <p className="text-xl font-semibold">粉丝概览</p>
          </div>
          <div className="md:w-full overflow-auto">
            <LineChart />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center">
        <div className="md:w-400 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-2xl p-6 m-3">
          <div className="flex justify-between">
            <p className="text-xl font-semibold">历史之最</p>
            <button type="button" className="text-xl font-semibold text-gray-500">
              <IoIosMore />
            </button>
          </div>

          <div className="mt-10 ">
            {weeklyStats.map((item) => (
              <div key={item.title} className="flex justify-between mt-4 w-full">
                <div className="flex gap-4">
                  <button
                    type="button"
                    style={{ background: item.iconBg }}
                    className="text-2xl hover:drop-shadow-xl text-white rounded-full p-3"
                  >
                    {item.icon}
                  </button>
                  <div>
                    <p className="text-md font-semibold">{item.title}</p>
                    <p className="text-sm text-gray-400">{item.desc}</p>
                  </div>
                </div>

                <p className={`text-${item.pcColor}`}>{item.amount}</p>
              </div>
            ))}
            <div className="mt-4">
              <SparkLine currentColor={currentColor} id="area-sparkLine" height="160px" type="Area" data={SparklineAreaData} width="320" color="rgb(242, 252, 253)" />
            </div>
          </div>

        </div>
     

        <div className="w-400 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-2xl p-6 m-3">
          <div className="flex justify-between">
            <p className="text-xl font-semibold">自媒体创作</p>
            <button type="button" className="text-xl font-semibold text-gray-500">
              <IoIosMore />
            </button>
          </div>
          <div className="mt-10">
            <img
              className="md:w-96 h-50 "
              src={product9}
              alt=""
            />
            <div className="mt-8">
              <p className="font-semibold text-lg">偷 是成为大师的第一步</p>
              <p className="text-gray-400 ">路径依赖 建立试听期待</p>
              <p className="mt-8 text-sm text-gray-400">
              高端品牌要隐约带点伤感，悲天悯人的感觉。
              中端品牌要温柔，让人与世界和解。
              低端品牌要欢快，就是乐。
              入门级品牌要屌，愤怒，挑翻操蛋的世界。
              </p>
    
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ecommerce;
