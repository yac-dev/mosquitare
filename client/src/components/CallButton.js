import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import store from '../store';
import { Dropdown } from 'semantic-ui-react';
import VoiceChatIcon from '@mui/icons-material/VoiceChat';
import DuoIcon from '@mui/icons-material/Duo';

// mui for option
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// action creators
import { callActionCreator } from '../actionCreators/mediaActionCreator';

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
      },
    },
  },
}));

const CallButton = (props) => {
  // const [exchangeableLanguageTable,setExchangeableLanguageTable ] = useState({langs: {'learning': null,'native': null}})
  const [exchangeableLearningLangs, setExchangeableLearningLangs] = useState([]);
  const [exchangeableNativeLangs, setExchangeableNativeLangs] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    const myLearningLangs = store.getState().authState.currentUser.learningLangs;
    console.log(myLearningLangs);
    console.log(props.user.nativeLangs);
    for (let i = 0; i < myLearningLangs.length; i++) {
      for (let j = 0; j < props.user.nativeLangs.length; j++) {
        if (myLearningLangs[i]._id === props.user.nativeLangs[j]._id) {
          setExchangeableLearningLangs((previousState) => [...previousState, myLearningLangs[i]]);
        }
      }
    } // O(^2)

    const myNativeLangs = store.getState().authState.currentUser.nativeLangs;
    for (let i = 0; i < myNativeLangs.length; i++) {
      for (let j = 0; j < props.user.learningLangs.length; j++) {
        if (myNativeLangs[i]._id === props.user.learningLangs[j]._id) {
          console.log(myNativeLangs[i]._id === props.user.learningLangs[j]._id);
          setExchangeableNativeLangs((previousState) => [...previousState, myNativeLangs[i]]);
        }
      }
    } // O(^2)
  }, [props.user]);

  const renderExchangeableLangs = () => {
    console.log('renderExchangeableLangs');
    const menuItemDOMS = [];
    if (exchangeableLearningLangs.length && exchangeableNativeLangs.length) {
      console.log(exchangeableLearningLangs, exchangeableNativeLangs);
      for (let i = 0; i < exchangeableLearningLangs.length; i++) {
        for (let j = 0; j < exchangeableNativeLangs.length; j++) {
          menuItemDOMS.push(
            <>
              <MenuItem onClick={handleClose} disableRipple>
                Exchange {exchangeableLearningLangs[i].name} &amp; {exchangeableNativeLangs[j].name}
              </MenuItem>
            </>
          );
        }
      }

      // return (
      //   <StyledMenu
      //     id='demo-customized-menu'
      //     MenuListProps={{
      //       'aria-labelledby': 'demo-customized-button',
      //     }}
      //     anchorEl={anchorEl}
      //     open={open}
      //     onClose={handleClose}
      //   >
      //     {renderMenuItems}
      //   </StyledMenu>
      // );
      // const menuItems = exchangeableLearningLangs.map((learningLang) => {
      //   return exchangeableNativeLangs.map((nativeLang) => {
      //     return (
      //       <MenuItem onClick={handleClose} disableRipple>
      //         {learningLang.name} &amp; {nativeLang.name}
      //       </MenuItem>
      //     );
      //   });
      // });

      return (
        <>
          <Button
            id='demo-customized-button'
            aria-controls={open ? 'demo-customized-menu' : undefined}
            aria-haspopup='true'
            aria-expanded={open ? 'true' : undefined}
            variant='contained'
            disableElevation
            onClick={handleClick}
            endIcon={<KeyboardArrowDownIcon />}
          >
            Exchange
          </Button>
          <StyledMenu
            id='demo-customized-menu'
            MenuListProps={{
              'aria-labelledby': 'demo-customized-button',
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            {menuItemDOMS}
          </StyledMenu>
        </>
      );
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const onCallClick = (event, oppositeSocketId, startLanguage) => {
    event.preventDefault();
    props.setIsPopupOpen(false);
    const mySocketId = props.authState.currentUser.socketId;
    props.setShowCallingModal(true);
    props.callActionCreator(props.socket, mySocketId, oppositeSocketId, startLanguage);
  };

  // const checkCallableOrNot = () => {
  //   for (let i = 0; i < props.user.nativeLangs.length; i++) {
  //     for (let j = 0; j < props.authState.currentUser.learningLangs.length; j++) {
  //       if (props.user.nativeLangs[i].name === props.authState.currentUser.learningLangs[j].name) {
  //         return 'false';
  //       } else {
  //         return 'true';
  //       }
  //     }
  //   }
  // }; // 分からん。。。

  // const renderMenuItems = () => {
  //   // 仕事しすぎね。ここ。O(^4)
  //   const menuItems = [];
  //   for (let i = 0; i < props.authState.currentUser.learningLangs.length; i++) {
  //     for (let j = 0; j < props.user.nativeLangs.length; j++) {
  //       if (props.authState.currentUser.learningLangs[i].name === props.user.learningLangs[j].name) {
  //         for (let k = 0; k < props.authState.currentUser.nativeLangs.length; k++) {
  //           for (let l = 0; l < props.user.learningLangs.length; l++) {
  //             if (props.authState.currentUser.nativeLangs[k].name === props.user.learningLangs[l].name) {
  //               menuItems.push(
  //                 <>
  //                   <MenuItem onClick={handleClose} disableRipple>
  //                     Exchange {props.authState.currentUser.learningLangs[i].name} &amp;{' '}
  //                     {props.authState.currentUser.nativeLangs[k].name}
  //                   </MenuItem>
  //                 </>
  //               );
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  return <>{renderExchangeableLangs()}</>;
};

// const renderLanguageDropdownMenu = () => {
//   const languageDropdown = props.user.nativeLangs.map((language) => {
//     return (
//       <Dropdown.Item
//         label={{ color: 'red', empty: true, circular: true }}
//         onClick={(event) => onCallClick(event, props.user.socketId, language)}
//         // disabled={checkCallableOrNot()}
//       >
//         {language.name}&nbsp; <DuoIcon />
//       </Dropdown.Item>
//     );
//   });

// return (
// <Dropdown
//   text={`Call`}
//   pointing='right'
//   button
//   floating
//   labeled
//   className='icon'
//   style={{ backgroundColor: 'lightgreen' }}
// >
//   <Dropdown.Menu>
//     <Dropdown.Header content='Which language you wanna speak in with this partner?' />
//     <Dropdown.Divider />
//     {languageDropdown}
//   </Dropdown.Menu>
// </Dropdown>
// <>
//   <Button
//     id='demo-customized-button'
//     aria-controls={open ? 'demo-customized-menu' : undefined}
//     aria-haspopup='true'
//     aria-expanded={open ? 'true' : undefined}
//     variant='contained'
//     disableElevation
//     onClick={handleClick}
//     endIcon={<KeyboardArrowDownIcon />}
//   >
//     Exchange
//   </Button>
//   <StyledMenu
//     id='demo-customized-menu'
//     MenuListProps={{
//       'aria-labelledby': 'demo-customized-button',
//     }}
//     anchorEl={anchorEl}
//     open={open}
//     onClose={handleClose}
//   >
//     {/* <MenuItem onClick={handleClose} disableRipple>
//       Edit
//     </MenuItem>
//     <MenuItem onClick={handleClose} disableRipple>
//       Duplicate
//     </MenuItem>
//     <MenuItem onClick={handleClose} disableRipple>
//       Archive
//     </MenuItem>
//     <MenuItem onClick={handleClose} disableRipple>
//       More
//     </MenuItem> */}
//     {/* {renderMenuItems()} */}
//     {renderExchangeableLangs()}
//   </StyledMenu>
// </>
// );
// };

const mapStateToProps = (state) => {
  return { authState: state.authState };
};

export default connect(mapStateToProps, { callActionCreator })(CallButton);
