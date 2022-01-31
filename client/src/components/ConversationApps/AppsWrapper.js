import React from 'react';
import { Icon } from 'semantic-ui-react';
import CurrencyConvertor from './CurrencyConvertor';

const AppsWrapper = () => {
  return (
    <div className='apps-wrapper'>
      <div className='currency-app'>
        <i className='dollar sign icon'></i>
        <i className='exchange alternate icon'></i>
        <i className='euro sign icon'></i>
      </div>
      <div className='translator-app'>
        <Icon enabled name='translate' size='big' />
      </div>
      <div className='map-app'>
        <Icon enabled name='world' size='big' />
      </div>
      <div className='doc-share-app'>
        <Icon enabled name='copy outline' size='big' />
      </div>
      <div className='cheat-sheet-app'>
        <Icon enabled name='file alternate outline' size='big' />
      </div>
      <div className='screen-share-app'>
        <Icon enabled name='laptop' size='big' />
        <Icon enabled name='desktop' size='big' />
      </div>
      <div className='calculator-app'>
        <Icon enabled name='calculator' size='big' />
      </div>
      <div className='weather-and-time-app'>
        <Icon enabled name='sun outline' size='big' />
        <Icon enabled name='clock outline' size='big' />
      </div>
      <div className='whiteboard-app'>
        <Icon enabled name='edit outline' size='big' />
      </div>
    </div>
  );
};

export default AppsWrapper;
