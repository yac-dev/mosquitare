import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ChatIcon from '@mui/icons-material/Chat';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';

import Chat from './Chat';
import SubtitleWrapper from './Modal/SubtitleWrapper';

import React, { useState } from 'react';

const VerticalTabsWrapper = (props) => {
  const [isActiveChatComponent, setIsActiveChatComponent] = useState(true);
  const [isActiveTranscriptComponent, setIsActiveTranscriptComponent] = useState(false);

  const activateChatComponent = () => {
    setIsActiveChatComponent(true);
    setIsActiveTranscriptComponent(false);
  };

  const activateTranscriptComponent = () => {
    setIsActiveChatComponent(false);
    setIsActiveTranscriptComponent(true);
  };

  return (
    <div className='vertical-tabs-wrapper'>
      <div className='tabs' style={{ borderRight: '1px solid white' }}>
        <div
          className={`chat-tab ${isActiveChatComponent ? 'active' : undefined}`}
          onClick={() => activateChatComponent(false)}
          style={{ color: 'white', marginBottom: '5px', cursor: 'pointer' }}
        >
          <p className={`tab-word ${isActiveChatComponent ? 'word-active' : undefined}`}>
            Chat&nbsp;
            <IconButton>
              <ChatIcon />
            </IconButton>
          </p>
        </div>
        <div
          className={`transcript-tab ${isActiveTranscriptComponent ? 'active' : undefined}`}
          onClick={() => activateTranscriptComponent(false)}
          style={{ color: 'white', marginBottom: '5px', cursor: 'pointer' }}
        >
          <p className={`tab-word ${isActiveTranscriptComponent ? 'word-active' : undefined}`}>
            Transcript&nbsp;
            <IconButton>
              <RecordVoiceOverIcon />
            </IconButton>
          </p>
        </div>
      </div>
      <Chat isActiveChatComponent={isActiveChatComponent} />
      <SubtitleWrapper socket={props.socket} isActiveTranscriptComponent={isActiveTranscriptComponent} />
    </div>
  );
};

export default VerticalTabsWrapper;

// function TabPanel(props) {
//   const { children, value, index, ...other } = props;

//   return (
//     <div
//       role='tabpanel'
//       hidden={value !== index}
//       id={`vertical-tabpanel-${index}`}
//       aria-labelledby={`vertical-tab-${index}`}
//       {...other}
//     >
//       {value === index && (
//         <Box sx={{ p: 3 }}>
//           <Typography>{children}</Typography>
//         </Box>
//       )}
//     </div>
//   );
// }

// TabPanel.propTypes = {
//   children: PropTypes.node,
//   index: PropTypes.number.isRequired,
//   value: PropTypes.number.isRequired,
// };

// function a11yProps(index) {
//   return {
//     id: `vertical-tab-${index}`,
//     'aria-controls': `vertical-tabpanel-${index}`,
//   };
// }

// const VerticalTabs = (props) => {
//   const [value, setValue] = React.useState(0);

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };

//   return (
//     <Box sx={{ flexGrow: 1, bgcolor: 'rgba(0, 0, 0, 0.84)', display: 'flex', color: 'white' }} className='texts'>
//       <Tabs
//         orientation='vertical'
//         // variant='scrollable'
//         value={value}
//         onChange={handleChange}
//         aria-label='Vertical tabs example'
//         sx={{ borderRight: 1, borderColor: 'divider', color: 'white' }}
//       >
//         <Tab label='chat' {...a11yProps(0)} sx={{ color: 'white' }} />
//         <Tab label='subtitles' {...a11yProps(1)} sx={{ color: 'white' }} />
//       </Tabs>
//       <TabPanel value={value} index={0}>
//         here is a chat tab
//       </TabPanel>
//       <TabPanel value={value} index={1}>
//         <SubtitleWrapper
//           socket={props.socket}
//           setLearningLanguageScript={props.setLearningLanguageScript}
//           setNativeLanguageScript={props.setNativeLanguageScript}
//         />
//       </TabPanel>
//     </Box>
//   );
// };

// export default VerticalTabs;
