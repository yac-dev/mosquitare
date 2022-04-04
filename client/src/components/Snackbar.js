import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

// mui components
import MuiSnackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

//ac
import { removeAlertActionCreator } from '../actionCreators/alertsActionCreator';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

const Snackbar = (props) => {
  // const [state, setState] = useState({ open: false, vertical: 'top', horizontal: 'right' });
  // const [openError,  setOpenError] = useState(false);
  // const [openSuccess, setOpenSuccess] = useState(false);

  // const handleClick = () => {
  //   setOpen(true);
  // };

  // useEffect(() => {
  //   if (props.open) {
  //     setState({ ...state, open: true });
  //   }
  // }, [props.open]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    // setState({ ...state, open: false });
    // const newErrors = props.errors.filter((error, index) => index !== props.index);
    // props.setErrors(newErrors);
    props.removeAlertActionCreator(props.id);
  };

  return (
    <>
      {/* <MuiSnackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity='success' sx={{ width: '100%' }}>
          This is a success message!
        </Alert>
      </MuiSnackbar> */}
      {/* <MuiSnackbar open={open} anchorOrigin={{ vertical, horizontal }} onClose={handleClose}> */}
      <Alert onClose={handleClose} elevation={6} sx={{ width: '100%' }} severity={props.snackBarType}>
        {props.message}
      </Alert>
      {/* </MuiSnackbar> */}
      {/* <MuiSnackbar>
        <Alert severity='warning'>This is a warning message!</Alert>
      </MuiSnackbar>
      <MuiSnackbar>
        <Alert severity='info'>This is an information message!</Alert>
      </MuiSnackbar> */}
    </>
  );
};

const mapStateToProps = () => {};

export default connect(mapStateToProps, { removeAlertActionCreator })(Snackbar);
