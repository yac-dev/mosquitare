import React, { useEffect, useState, useRef } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Chart, Doughnut } from 'react-chartjs-2';
import { Pie } from 'react-chartjs-2';
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
    // tooltip: {
    //   enabled: false,
    // },
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
    const myLangs = [...props.user.learningLangs, ...props.user.nativeLangs];
    for (let i = 0; i < props.user.nativeLangs.length; i++) {
      for (let j = 0; j < myLangs.length; j++) {
        if (props.user.nativeLangs[i].language.name === myLangs[j].language.name) {
          // mappedLangLabels.push(`${myLangs[j].language.name} (native)`);
          mappedLangLabels.push(`${myLangs[j].language.name}`);
        } else {
          // mappedLangLabels.push(`${myLangs[j].language.name} (learning)`);
          mappedLangLabels.push(`${myLangs[j].language.name}`);
        }
      }
    }
    // 割合の計算
    const data = [];
    const myLangsStatus = myLangs.map((lang) => lang.words);
    const statusSum = myLangsStatus.reduce((partialSum, a) => partialSum + a, 0);
    myLangsStatus.forEach((langStatus) => {
      if (langStatus === 0) {
        data.push(0);
      } else {
        const ratio = Math.floor((langStatus / statusSum) * 100);
        data.push(ratio);
      }
    });

    // const renderBgColor = () => {}

    // const languageBgColors = [];
    //     for (let i = 0; i < myLangsStatus.length; i++) {
    //       if (myLangsStatus[i] >= 50) {
    //         languageBgColors.push('rgba(255, 140, 0)');
    //       } else if (myLangsStatus[i] <= 7.9 && myLangsStatus[i] >= 6.0) {
    //         languageBgColors.push('rgb(255, 0, 187)');
    //       } else if (myLangsStatus[i] <= 5.9 && myLangsStatus[i] >= 4.0) {
    //         languageBgColors.push('rgb(255, 0, 0)');
    //       } else if (myLangsStatus[i] <= 3.9 && myLangsStatus[i] >= 2.0) {
    //         languageBgColors.push('rgb(255, 213, 0)');
    //       } else if (myLangsStatus[i] <= 1.9) {
    //         languageBgColors.push('rgb(0, 255, 255)');
    //       }
    //     }
    const d = {
      labels: mappedLangLabels,
      datasets: [
        {
          label: 'Language Status',
          data: data,
          // backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)'],
          backgroundColor: ['rgba(37, 95, 184)', 'rgb(0, 186, 68)', 'rgb(214, 198, 49)', 'rgb(181, 32, 230)', ''],
          // borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
          borderWidth: 1,
          hoverOffset: 30,
        },
      ],
    };
    setData(d);
  }, [props.user]);
  // ここのdependencyが足りなかったのよ。これだから怖い。programmingは。。。

  const renderDefaultDoughnut = () => {
    const data = {
      labels: '',
      datasets: [
        {
          label: 'Language Status',
          data: [1],
          // backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)'],
          backgroundColor: ['rgb(181, 181, 181)'],
          // borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
          borderWidth: 1,
          hoverOffset: 30,
        },
      ],
    };

    const options = {
      hover: { mode: null },
      plugins: {
        legend: {
          display: false,
          // position: 'left',
        },
        // tooltip: {
        //   enabled: false,
        // },
        // responsive: true,

        datalabels: {
          display: true,
          formatter: (val, ctx) => {
            return 'No data 🤔';
          },
          color: '#fff',
          backgroundColor: '#404040',
        },
      },
      maintainAspectRatio: false, // これだ。resizeな。pluginの外に出すとできたよ。
    };

    return <Doughnut data={data} options={options} width={200} height={200} />;
  };

  const renderDoughnut = () => {
    return <Doughnut data={data} options={options} width={200} height={200} />;
  };

  // 何がnativeかと何を勉強したいかの表示ね。
  const renderInitialData = () => {
    return <div>No data.</div>;
  };

  const render = () => {
    const myLangs = [...props.user.learningLangs, ...props.user.nativeLangs];
    const myLangsStatus = myLangs.map((lang) => lang.words);
    // const statusSum = myLangsStatus.reduce((partialSum, a) => partialSum + a, 0);
    // for (let i = 0; i < props.user.myLangsStatus.length; i++) {}　あとでこっちに書き換えよう。シンプルにfor loopで、全部0なら　No dataってrenderする方が分かりやすい。
    // if (statusSum === 0) {
    //   return <>{renderInitialData()}</>;
    // } else if (data) {
    //   return <div style={{ width: '99%' }}>{renderDoughnut()}</div>;
    // }

    if (myLangsStatus.every((element) => element === 0)) {
      return <>{renderDefaultDoughnut()}</>;
    } else if (data) {
      return (
        <div
        // style={{ width: '99%' }}
        // style={{ width: '100%' }}
        >
          {renderDoughnut()}
        </div>
      );
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
