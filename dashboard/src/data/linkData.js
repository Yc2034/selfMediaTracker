import {  AiOutlineShoppingCart,  AiOutlineStock } from 'react-icons/ai';
import { FiShoppingBag, FiPieChart } from 'react-icons/fi';
import { BsKanban, BsBarChart } from 'react-icons/bs';
import { IoMdContacts } from 'react-icons/io';
import { GiLouvrePyramid } from 'react-icons/gi';

export const links = [
    {
      title: 'Fans Dashboard',
      links: [
        {
          name: 'dashboard',
          icon: <FiShoppingBag />,
        },
      ],
    },
  
    {
      title: 'Hot Topics',
      links: [
        {
          name: 'hottopics',
          icon: <AiOutlineShoppingCart />,
        },
        {
          name: 'vloggers',
          icon: <IoMdContacts />,
        },
      ],
    },
    {
      title: 'Published Themes',
      links: [
        {
          name: 'topics',
          icon: <BsKanban />,
        }
      ],
    },
    {
      title: 'Fans Charts',
      links: [
        {
          name: 'line',
          icon: <AiOutlineStock />,
        },
  
        {
          name: 'pieAgeAndCity',
          icon: <FiPieChart />,
        },
        {
          name: 'weather',
          icon: <BsBarChart />,
        },
        {
          name: 'pyramid',
          icon: <GiLouvrePyramid />,
        }
     
      ],
    },
  ];