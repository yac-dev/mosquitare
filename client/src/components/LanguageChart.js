import React, { useEffect, useState, useRef } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Chart, Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);
// ChartJS.plugins.register(ChartDataLabels);

// 最大で20個くらいの色のoptionを用意しておいて割り振っていけばいいか。20言語以上のmyLangsになる特殊なやつ多分いないだろう。
export const colorOptions = [
  'rgba(255, 99, 132, 0.2)',
  'rgba(54, 162, 235, 0.2)',
  'rgba(255, 206, 86, 0.2)',
  'rgba(75, 192, 192, 0.2)',
  'rgba(153, 102, 255, 0.2)',
  'rgba(255, 159, 64, 0.2)',
  'rgba(255, 32, 64, 0.2)',
  'rgba(255, 187, 64, 0.2)',
  'rgba(3, 34, 64, 0.2)',
  'rgba(25, 159, 64, 0.2)',
  'rgba(55, 19, 64, 0.2)',
];

const options = {
  plugins: {
    legend: {
      display: false,
      // position: 'left',
    },
    tooltip: {
      enabled: false,
    },
    // responsive: true,

    datalabels: {
      display: true,
      formatter: (val, ctx) => {
        return `${ctx.chart.data.labels[ctx.dataIndex]} ${val}%`;
      },
      color: '#fff',
      backgroundColor: '#404040',
    },
  },
  maintainAspectRatio: false, // これだ。resizeな。pluginの外に出すとできたよ。
};

const LanguageChart = (props) => {
  const chartRef = useRef();
  const [langLabels, setLangLabels] = useState([]);
  const [langBackgroundColors, setLangBackgroundColors] = useState([
    'rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
  ]);
  const [borderColors, setBorderColors] = useState([
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
  ]);
  const [data, setData] = useState(null);

  useEffect(() => {
    console.log(props.user);
    const mappedLangLabels = [];
    for (let i = 0; i < props.user.nativeLangs.length; i++) {
      for (let j = 0; j < props.user.myLangs.length; j++) {
        if (props.user.nativeLangs[i].name === props.user.myLangs[j].name) {
          mappedLangLabels.push(`${props.user.myLangs[j].name} (native)`);
        } else {
          mappedLangLabels.push(`${props.user.myLangs[j].name} (learning)`);
        }
      }
    }
    const d = {
      labels: mappedLangLabels,
      datasets: [
        {
          label: 'Language Status',
          data: props.user.myLangsStatus,
          backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)'],
          borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
          borderWidth: 1,
          hoverOffset: 30,
        },
      ],
    };
    setData(d);
  }, [props.user]);
  // ここのdependencyが足りなかったのよ。これだから怖い。programmingは。。。

  const renderDoughnut = () => {
    return <Doughnut data={data} options={options} width={150} height={150} />;
  };

  // 何がnativeかと何を勉強したいかの表示ね。
  const renderInitialData = () => {
    return <div>No data.</div>;
  };

  const render = () => {
    const statusSum = props.user.myLangsStatus.reduce((partialSum, a) => partialSum + a, 0);
    if (statusSum === 0) {
      return <>{renderInitialData()}</>;
    } else if (data) {
      return <div style={{ width: '99%' }}>{renderDoughnut()}</div>;
    }
  };

  return (
    <>
      {render()}
      {/* {renderDoughnut()} */}
      {/* {renderInitialData()} */}
    </>
  );
};

export default LanguageChart;
