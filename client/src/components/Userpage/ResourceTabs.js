import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Icon } from 'semantic-ui-react';

// components
import Chat from './Chat';
import Transcript from './Transcript';
import Comments from './Comments';

const ResourceTabs = () => {
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  //'https://www.w3schools.com/html/mov_bbb.mp4'
  return (
    // でかいwrapperとしてのclassnameをつけるべきだな。ここに。
    <div className='resource-tab'>
      resource tab here
      {/* <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label='lab API tabs example'>
              <Tab label={`Chat ${(<Icon enabled name='comment outline' size='small' />)}`} value='1' />
              <Tab label={`Transcript ${(<Icon enabled name='file alternate outline' size='small' />)}`} value='2' />
              <Tab label={`Comments ${(<Icon enabled name='comments outline' size='small' />)}`} value='3' />
            </TabList>
          </Box>
          <TabPanel value='1'>
            <Chat />
          </TabPanel>
          <TabPanel value='2'>
            <Transcript />
          </TabPanel>
          <TabPanel value='3'>
            <Comments />
          </TabPanel>
        </TabContext>
      </Box> */}
    </div>
  );
};

export default ResourceTabs;
