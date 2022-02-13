import React, { useEffect, useState, useRef } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Chart, Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

// 最大で20個くらいの色のoptionを用意しておいて割り振っていけばいいか。20言語以上のmyLangsになる特殊なやつ多分いないだろう。
export const colorOptions = [
  // 'lightgreen',
  // 'lightblue',
  // 'mediumorchid',
  // 'tomato',
  // 'burlywood',
  // 'sienna',
  // 'navy',
  // 'darkgreen',
  // 'skyblue',
  // 'gold',
  // 'mistyrose',
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

// const data = {
//   labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
//   datasets: [
//     {
//       label: 'Language Status',
//       data: [12, 19, 3, 5, 2, 3],
//       backgroundColor: [
//         'rgba(255, 99, 132, 0.2)',
//         'rgba(54, 162, 235, 0.2)',
//         'rgba(255, 206, 86, 0.2)',
//         'rgba(75, 192, 192, 0.2)',
//         'rgba(153, 102, 255, 0.2)',
//         'rgba(255, 159, 64, 0.2)',
//       ],
//       borderColor: [
//         'rgba(255, 99, 132, 1)',
//         'rgba(54, 162, 235, 1)',
//         'rgba(255, 206, 86, 1)',
//         'rgba(75, 192, 192, 1)',
//         'rgba(153, 102, 255, 1)',
//         'rgba(255, 159, 64, 1)',
//       ],
//       borderWidth: 1,
//       hoverOffset: 50,
//     },
//   ],
// };

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
  const [langData, setLangData] = useState([]);
  // const [datasets, setDatasets] = useState([
  //   { label: '', data: [], backgroundColor: [], borderColor: [], borderWidth: 0, hoverOffset: 0 },
  // ]);
  const [data, setData] = useState(null);

  useEffect(() => {
    // console.log(props.user);
    const mappedLangLabels = props.user.myLangs.map((lang) => {
      return lang.name;
    });
    // setLangLabels((previousState) => [...previousState, mappedLangLabels]);
    // setLangData((previousState) => [...previousState, props.user.myLangsStatus]);
    // const insertingData = { ...data };
    // insertingData.labels = langLabels;
    // insertingData.datasets[0].label = 'Language Status';
    // insertingData.datasets[0].data = langData;
    // insertingData.datasets[0].backgroundColor = langBackgroundColors;
    // insertingData.datasets[0].borderColor = borderColors;
    // insertingData.datasets[0].borderWidth = 1;
    // insertingData.datasets[0].hoverOffset = 50;
    // setData(insertingData);
    const d = {
      labels: mappedLangLabels,
      datasets: [
        {
          label: 'Language Status',
          data: props.user.myLangsStatus,
          backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)'],
          borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
          borderWidth: 1,
          hoverOffset: 50,
        },
      ],
    };
    setData(d);

    // console.log(langLabels);

    // const bgcs = new Array(props.user.myLangs.length).fill(
    //   colorOptions[Math.floor(Math.random() * colorOptions.length)]
    // );
    // const bgcs = ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)'];

    // setLangBackgroundColors((previousState) => [...previousState, bgcs]);
    // setBorderColors((previousState) => [...previousState, bgcs]);
  }, []);

  // useEffect(() => {
  //   if (langLabels.length && langBackgroundColors.length && borderColors.length && langData.length) {
  //     // console.log(langLabels);
  //     // console.log(langBackgroundColors);
  //     // console.log(borderColors);
  //     // console.log(langData);
  //     const insertingData = { ...data };
  //     insertingData.labels = langLabels;
  //     insertingData.datasets[0].label = 'Language Status';
  //     insertingData.datasets[0].data = langData;
  //     insertingData.datasets[0].backgroundColor = langBackgroundColors;
  //     insertingData.datasets[0].borderColor = borderColors;
  //     insertingData.datasets[0].borderWidth = 1;
  //     insertingData.datasets[0].hoverOffset = 50;
  //     setData(insertingData);
  //   }
  // }, [langLabels, langBackgroundColors, borderColors, langData]);

  // useEffect(() => {
  //   if (
  //     langLabels.length &&
  //     langBackgroundColors.length &&
  //     borderColors.length &&
  //     langData.length &&
  //     datasets.length === 1
  //   ) {
  //     setData({
  //       ...data,
  //       labels: langLabels,
  //       datasets: datasets,
  //     });
  //   }
  // }, [langLabels, langBackgroundColors, borderColors, langData, datasets]);

  // useEffect(() => {
  //   if (data.labels.length && data.datasets[0].data.length) {
  //     console.log(data);
  //   }
  // }, [data]);

  const renderDoughnut = () => {
    if (data) {
      return (
        <Doughnut
          data={data}
          width={50}
          height={50}
          options={{
            responsive: true,
            // legend: { display: false },
            // title: { display: true, text: 'Açılan Oylar' },
          }}
        />
      );
    }
  };

  return (
    <>
      {/* <canvas ref={chartRef} width={50} height={50} /> */}
      {renderDoughnut()}
    </>
  );
};

export default LanguageChart;
