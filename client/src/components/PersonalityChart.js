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

const labels = ['💪 Enthusiastic', '😄 Friendly', '🧑‍🏫 Patient', '✍️ Helpful', '🤝 Respect Culture'];

const PersonalityChart = (props) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const ratingAverageData = Object.values(props.user.ratingAverage).slice(0, 5);
    const d = {
      labels,
      datasets: [
        {
          data: ratingAverageData,
          backgroundColor: [
            'rgba(37, 95, 184)',
            'rgb(44, 184, 63)',
            'rgba(37, 95, 184)',
            'rgb(44, 184, 63)',
            'rgba(37, 95, 184)',
            // 'rgba(64, 173, 173, 0.2)',
          ],
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

  const renderBar = () => {
    return <Bar data={data} options={options} width={400} height={150} />;
  };

  const renderInitialData = () => {
    return <div>No data.</div>;
  };

  const render = () => {
    if (data.every((element) => element === 0)) {
      return <>{renderInitialData()}</>;
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

export default PersonalityChart;
