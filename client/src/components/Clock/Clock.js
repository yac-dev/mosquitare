import React, { useEffect, useState } from 'react';
import AnalogClock from 'react-clock';
import 'react-clock/dist/Clock.css';
import { Marker } from 'react-map-gl';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Popover from '@mui/material/Popover';
import Box from '@mui/material/Box';

const Clock = (props) => {
  function changeTimezone(date, ianatz) {
    var invdate = new Date(
      date.toLocaleString('en-US', {
        timeZone: ianatz,
      })
    );
    var diff = date.getTime() - invdate.getTime();
    return new Date(date.getTime() - diff);
  }

  const current = changeTimezone(new Date(), props.timeZone);
  const date = `${current.getDate()}/${current.getMonth() + 1}`;
  const time = current.toLocaleString('en-GB', { hour: '2-digit', minute: '2-digit' });

  // var here = new Date();
  // var there = changeTimezone(here, "America/Toronto");
  const [value, setValue] = useState(changeTimezone(new Date(), props.timeZone));
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  useEffect(() => {
    const interval = setInterval(() => setValue(changeTimezone(new Date(), props.timeZone)), 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <Marker
        // position={{ lat: props.user.location.coordinates[1], lng: props.user.location.coordinates[0] }}
        longitude={props.coordinates[0]}
        latitude={props.coordinates[1]}
        // offsetLeft={-3.5 * props.viewport.zoom}
        // offsetTop={-7 * props.viewport.zoom}
        // ここonClickは、今自分がどのcomponent内にいるかで実行するものが変わるようにしたいんだよな。
      >
        <Popover
          id='mouse-over-popover'
          sx={{
            pointerEvents: 'none',
          }}
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          onClose={handlePopoverClose}
          disableRestoreFocus
        >
          <div style={{ textAlign: 'center', padding: '10px' }}>
            <div>
              <img
                loading='lazy'
                width='20'
                src={`https://flagcdn.com/w20/${props.flag}.png`}
                srcSet={`https://flagcdn.com/w40/${props.flag}.png 2x`}
                alt=''
              />
              &nbsp;&nbsp;
              <span style={{ fontWeight: 'bold' }}>{props.city}</span>
            </div>
            <h4>
              {date}&nbsp;&nbsp;{time}
            </h4>
            <AnalogClock value={value} />
          </div>
        </Popover>
        <AccessTimeIcon
          sx={{ fontSize: '30px', color: 'rgb(170, 170, 170)' }}
          style={{ cursor: 'pointer' }}
          onMouseEnter={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}
        />
      </Marker>
    </>
  );
};

export default Clock;
