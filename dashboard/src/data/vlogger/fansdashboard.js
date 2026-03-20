

import { MdOutlineSupervisorAccount } from 'react-icons/md';
import { HiOutlineRefresh } from 'react-icons/hi';
import {  FiBarChart, FiCreditCard, FiStar, FiShoppingCart } from 'react-icons/fi';
import { BsBoxSeam, BsCurrencyDollar, BsShield, BsChatLeft } from 'react-icons/bs';
import { TiTick } from 'react-icons/ti';

export const RedFans  = '30,930';
export const DouyinFans = '4,055';

const numRedLikes = '151,000';
const numRedPosts = '87';

const numDouyinLikes = '23,000';
const numDouyinPosts = '59';



export const weekReportHighlight = [
    {
      icon: <TiTick />,
      amount: '2022/04/15',
      title: '三丽鸥插画',
      desc: '三丽鸥壁纸系列',
      iconColor: 'rgb(255, 244, 229)',
      iconBg: 'rgb(254, 201, 15)',
      pcColor: 'green-600',
    },
    {
      icon: <TiTick />,
      amount: '2021/06/14',
      title: '重绘我的童年',
      desc: '出圈+被运营注意到',
      iconColor: 'rgb(228, 106, 118)',
      iconBg: 'rgb(255, 244, 229)',
      pcColor: 'green-600',
    },
    {
      icon: <TiTick />,
      amount: '2021/05/28',
      title: '悬崖上的金鱼姬',
      desc: '运营活动/小红书火抖音凉',
      iconColor: 'rgb(228, 106, 118)',
      iconBg: 'rgb(255, 244, 229)',
      pcColor: 'green-600',
    },
    {
      icon: <BsShield />,
      amount: '2021/03/29',
      title: 'Procreate gif小猫动画',
      desc: 'Procreate教程/抖音火小红书不火',
      iconColor: 'rgb(0, 194, 146)',
      iconBg: 'rgb(235, 250, 242)',
      pcColor: 'red-600',
    },
    {
      icon: <BsShield />,
      amount: '2021/02/14',
      title: '玫瑰花/铃兰',
      desc: '花卉系列',
      iconColor: '#03C9D7',
      iconBg: '#E5FAFB',
      pcColor: 'green-600',
    },

  ];

  export const SparklineAreaData = [
    { x: 1, yval: 2 },
    { x: 2, yval: 6 },
    { x: 3, yval: 8 },
    { x: 4, yval: 5 },
    { x: 5, yval: 10 },
    { x: 6, yval: 9 },
    { x: 7, yval: 14 },
  
  ];
  
  export const weeklyStats = [
    {
      icon: <FiStar />,
      amount: '25,200+',
      title: '最多赞+收藏',
      desc: '三丽鸥(2) 2022/04/15',
      iconBg: '#FB9678',
      pcColor: 'red-600',
    },
    {
      icon: <FiShoppingCart />,
      amount: '¥66*100',
      title: '最多收入',
      desc: '直播课 2021/08/21',
      iconBg: 'rgb(254, 201, 15)',
      pcColor: 'red-600',
    },
    {
      icon: <BsChatLeft />,
      amount: '420+',
      title: '最多评论',
      desc: '三丽鸥(2) 2022/04/15',
      iconBg: '#00C292',
      pcColor: 'green-600',
    },
  ];
  

export const fansData = [
    {
      icon: <MdOutlineSupervisorAccount />,
      amount: numRedLikes,
      percentage: '+1%',
      title: '小红书赞+收藏',
      iconColor: '#03C9D7',
      iconBg: '#E5FAFB',
      pcColor: 'green-600',
    },
    {
      icon: <BsBoxSeam />,
      amount: numRedPosts,
      percentage: '+2%',
      title: '小红书笔记数',
      iconColor: '#03C9D7',
      iconBg: '#E5FAFB',
      pcColor: 'green-600',
    },
    {
      icon: <FiBarChart />,
      amount: numDouyinLikes,
      percentage: '+1%',
      title: '抖音点赞数',
      iconColor: 'rgb(228, 106, 118)',
      iconBg: 'rgb(255, 244, 229)',
  
      pcColor: 'green-600',
    },
    {
      icon: <HiOutlineRefresh />,
      amount: numDouyinPosts,
      percentage: '+2%',
      title: '抖音笔记数',
      iconColor: '#03C9D7',
      iconBg: '#E5FAFB',
      pcColor: 'green-600',
    },
  ];
  