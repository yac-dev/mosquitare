import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

// 最大で20個くらいの色のoptionを用意しておいて割り振っていけばいいか。20言語以上のmyLangsになる特殊なやつ多分いないだろう。
export const colorOptions = [
  'lightgreen',
  'lightblue',
  'mediumorchid',
  'tomato',
  'burlywood',
  'sienna',
  'navy',
  'darkgreen',
  'skyblue',
  'gold',
  'mistyrose',
];

const data = {
  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  datasets: [
    {
      label: 'Language Status',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

const LanguageChart = (props) => {
  const [labels, setLabels] = useState([]);
  const [langsData, setLangsData] = useState([]);
  const [backgroundColor, setBackgroundColor] = useState([]);
  const [borderColor, setBorderColor] = useState([]);
  const [data, setData] = useState({});

  useEffect(() => {
    const langLabels = props.user.myLangs.map((lang) => {
      return lang.name;
    });
    setLabels(langLabels);

    const langBackgroundColor = new Array(props.user.myLangs.length).fill(
      Math.floor(Math.random() * colorOptions.length)
    );
    setBackgroundColor(langBackgroundColor);
  }, []);

  useEffect(() => {
    if (labels && backgroundColor && borderColor) {
      setData({
        labels: labels,
        datasets: {
          label: 'Language Status',
          data: langsData,
          backgroundColor: backgroundColor,
          borderColor: backgroundColor,
          borderWidth: 1,
        },
      });
    }
  }, [labels, backgroundColor, borderColor]);

  const renderDoughnut = () => {
    if (data) {
      return <Doughnut data={data} />;
    } else {
      return null;
    }
  };

  return <>{renderDoughnut()}</>;
};

export default LanguageChart;
