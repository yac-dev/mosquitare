import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const options = {
  indexAxis: 'y',
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: false,
  plugins: {
    legend: {
      display: false,
    },
    datalabels: {
      color: 'rgb(232, 232, 232)',
      formatter: (val, ctx) => {
        if (val >= 8.0) {
          return 'A';
        } else if (val <= 7.9 && val >= 6.0) {
          return 'B';
        } else if (val <= 5.9 && val >= 4.0) {
          return 'C';
        } else if (val < 3.9 && val >= 2.0) {
          return 'D';
        } else if (val <= 1.9) {
          return 'F';
        }
        // return `${ctx.chart.data.labels[ctx.dataIndex]} ${val}%`;
      },
    },
  },
  scales: {
    x: {
      display: false,
      grid: {
        display: false,
      },

      // gridLines: {
      //   color: 'rgba(0, 0, 0, 0)',
      // },
    },
    y: {
      grid: {
        display: false,
      },
      ticks: {
        color: 'black',
      },
    },
  },
  maintainAspectRatio: false, // これだ。resizeな。pluginの外に出すとできたよ。
};

const labels = ['💪 Enthusiasm', '😄 Friendliness', '🧑‍🏫 Patience', '✍️ Cooperation', '🤝 Diversity'];

const PersonalityChartMobile = (props) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const ratingAverageData = Object.values(props.user.ratingAverage).slice(2, 7);
    const bgColors = [];
    for (let i = 0; i < ratingAverageData.length; i++) {
      if (ratingAverageData[i] >= 8.0) {
        bgColors.push('rgb(37, 95, 184)');
      } else if (ratingAverageData[i] <= 7.9 && ratingAverageData[i] >= 6.0) {
        bgColors.push('rgb(0, 186, 68)');
      } else if (ratingAverageData[i] <= 5.9 && ratingAverageData[i] >= 4.0) {
        bgColors.push('rgb(214, 198, 49)');
      } else if (ratingAverageData[i] <= 3.9 && ratingAverageData[i] >= 2.0) {
        bgColors.push('rgb(181, 32, 230)');
      } else if (ratingAverageData[i] <= 1.9) {
        bgColors.push('rgb(199, 32, 32)');
      }
    }
    const d = {
      labels,
      datasets: [
        {
          data: ratingAverageData,
          backgroundColor: bgColors,
          // [
          //   'rgba(37, 95, 184)',
          //   'rgb(44, 184, 63)',
          //   'rgba(37, 95, 184)',
          //   'rgb(44, 184, 63)',
          //   'rgba(37, 95, 184)',
          //   // 'rgba(64, 173, 173, 0.2)',
          // ],
          // borderColor: [
          //   'rgba(255, 99, 132, 1)',
          //   'rgba(54, 162, 235, 1)',
          //   'rgba(255, 206, 86, 1)',
          //   'rgba(63, 209, 82, 1)',
          //   'rgba(94, 53, 161,1)',
          // ],
          borderWidth: 1,
          hoverOffset: 30,
        },
      ],
    };
    setData(d);
  }, [props.user]);

  const renderDefaultBar = () => {
    const data = {
      labels,
      datasets: [
        {
          data: [],
          // backgroundColor: bgColors,
          // [
          //   'rgba(37, 95, 184)',
          //   'rgb(44, 184, 63)',
          //   'rgba(37, 95, 184)',
          //   'rgb(44, 184, 63)',
          //   'rgba(37, 95, 184)',
          //   // 'rgba(64, 173, 173, 0.2)',
          // ],
          // borderColor: [
          //   'rgba(255, 99, 132, 1)',
          //   'rgba(54, 162, 235, 1)',
          //   'rgba(255, 206, 86, 1)',
          //   'rgba(63, 209, 82, 1)',
          //   'rgba(94, 53, 161,1)',
          // ],
          borderWidth: 1,
          hoverOffset: 30,
        },
      ],
    };

    return (
      <>
        <span>No Data 🤔</span>
        <Bar data={data} options={options} width={200} height={200} />
      </>
    );
  };

  const renderBar = () => {
    return <Bar data={data} options={options} width={200} height={200} />;
  };

  const renderInitialData = () => {
    return <div>No data.</div>;
  };

  const render = () => {
    const ratingAverageData = Object.values(props.user.ratingAverage).slice(2, 7);
    if (ratingAverageData.every((element) => element === 0)) {
      return <>{renderDefaultBar()}</>;
    } else if (data) {
      return (
        <div
          // style={{ width: '99%' }}
          style={{ width: '100%' }}
        >
          {renderBar()}
        </div>
      );
    }
  };

  return <>{render()}</>;
};

export default PersonalityChartMobile;
