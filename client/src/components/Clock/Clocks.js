import React from 'react';
import Clock from './Clock';

const Clocks = () => {
  return (
    <>
      <Clock city='東京' coordinates={[139.6922, 35.6897]} timeZone='Asia/Tokyo' flag='jp' />
      <Clock city='New York' coordinates={[-73.9249, 40.6943]} timeZone='America/New_York' flag='us' />
      <Clock city='Los Angeles' coordinates={[-118.4068, 34.1139]} timeZone='America/Los_Angeles' flag='us' />
      <Clock city='São Paulo' coordinates={[-46.62529, -23.533773]} timeZone='America/Sao_Paulo' flag='br' />
      <Clock city='Johannesburg' coordinates={[28.034088, -26.195246]} timeZone='Africa/Johannesburg' flag='za' />
      <Clock city='London' coordinates={[-0.118092, 51.509865]} timeZone='Europe/London' flag='gb' />
      <Clock city='New Delhi' coordinates={[77.216721, 28.6448]} timeZone='Asia/Kolkata' flag='in' />
      <Clock city='北京' coordinates={[116.383331, 39.916668]} timeZone='Asia/Shanghai' flag='cn' />
      <Clock city='Москва' coordinates={[37.618423, 55.751244]} timeZone='Europe/Moscow' flag='ru' />
    </>
  );
};

export default Clocks;
