import React, { useState } from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

// mui icons
import TranslateIcon from '@mui/icons-material/Translate';

// components
import UserInfoLanguage from './UserInfoLanguage';
import UserInfoPersonal from './UserInfoPersonal';
import UserInfoVisited from './UserInfoVisited';

const UserInfoTabs = (props) => {
  const [key, setKey] = useState('language');
  return (
    <div className='user-info-tabs'>
      <Tabs id='controlled-tab-example' activeKey={key} onSelect={(k) => setKey(k)} className='mb-3'>
        <Tab eventKey='language' title='Language'>
          <UserInfoLanguage user={props.user} />
        </Tab>
        <Tab eventKey='personal' title='Personal'>
          <UserInfoPersonal user={props.user} />
        </Tab>
        <Tab eventKey='been' title='Been'>
          <UserInfoVisited user={props.user} />
          {/* <div>here</div> */}
        </Tab>
        {/* <Tab eventKey='videos' title='Videos'>
          <div>Hola</div>
        </Tab> */}
      </Tabs>
    </div>
  );
};

export default UserInfoTabs;
