import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import SubtitleWrapper from './Modal/SubtitleWrapper';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const VerticalTabs = (props) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'rgba(0, 0, 0, 0.84)', display: 'flex', color: 'white' }} className='texts'>
      <Tabs
        orientation='vertical'
        // variant='scrollable'
        value={value}
        onChange={handleChange}
        aria-label='Vertical tabs example'
        sx={{ borderRight: 1, borderColor: 'divider', color: 'white' }}
      >
        <Tab label='chat' {...a11yProps(0)} sx={{ color: 'white' }} />
        <Tab label='subtitles' {...a11yProps(1)} sx={{ color: 'white' }} />
      </Tabs>
      <TabPanel value={value} index={0}>
        here is a chat tab
      </TabPanel>
      <TabPanel value={value} index={1}>
        <SubtitleWrapper
          socket={props.socket}
          setLearningLanguageScript={props.setLearningLanguageScript}
          setNativeLanguageScript={props.setNativeLanguageScript}
        />
      </TabPanel>
    </Box>
  );
};

export default VerticalTabs;
