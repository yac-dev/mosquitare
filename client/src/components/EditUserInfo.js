import React, { useState, useCallback } from 'react';
import { connect } from 'react-redux';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../utils/cropImage';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';

import { setOpenEditModalActionCreator } from '../actionCreators/modalActionCreator';
import { setImageActionCreator } from '../actionCreators/imageActionCreator';
import { updateUserImageActionCreator } from '../actionCreators/authActionCreators';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});

const EditUserInfo = (props) => {
  const [croppedArea, setCroppedArea] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isClickedUpload, setIsClickedUpload] = useState(false);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    // console.log(croppedArea, croppedAreaPixels);
    setCroppedArea(croppedAreaPixels);
  }, []);

  const cropImage = async () => {
    // setLoading(true);
    try {
      const { file, url } = await getCroppedImg(props.imageState.image.url, croppedArea);
      // props.setImageActionCreator({ data: file, url });
      // ここで、api callをするのかね。。。
      localStorage.setItem('updated user image', true);
      props.updateUserImageActionCreator(file);
      // props.setOpenEditModalActionCreator(false);
      // setPhotoURL(url);
      // setFile(file);
      // setOpenCrop(false);
    } catch (error) {
      // setAlert({
      //   isAlert: true,
      //   severity: 'error',
      //   message: error.message,
      //   timeout: 5000,
      //   location: 'modal',
      // });
      console.log(error);
    }

    // setLoading(false);
  };

  const renderImage = () => {
    if (props.imageState.image) {
      return (
        <Cropper
          image={props.imageState.image.url}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      );
    }
  };

  const onUploadClick = () => {
    cropImage();
    setIsClickedUpload(true);
  };

  const renderUploadButton = () => {
    if (!isClickedUpload) {
      return (
        <Button variant='contained' startIcon={<AddAPhotoIcon />} onClick={() => onUploadClick()}>
          Upload
        </Button>
      );
    } else {
      return (
        <Button disabled startIcon={<HourglassTopIcon />}>
          Please wait a bit
        </Button>
      );
    }
  };

  return (
    <div>
      <Dialog
        open={props.modalState.editModal}
        TransitionComponent={Transition}
        maxWidth='xl'
        keepMounted
        onClose={() => props.setOpenEditModalActionCreator(false)}
        aria-describedby='alert-dialog-slide-description'
      >
        <DialogTitle>{'Set your profile picture!'}</DialogTitle>
        <DialogContent
          dividers
          sx={{
            background: '#333',
            position: 'relative',
            height: 400,
            width: 'auto',
            minWidth: { sm: 500 },
          }}
        >
          {/* <DialogContentText id='alert-dialog-slide-description'> */}
          <div className='App'>
            <div
              className='crop-container'
              style={{ position: 'absolute', top: '50px', left: '0', right: '0', bottom: '50px' }}
            >
              {renderImage()}
              {/* <Cropper
                image='https://img.huffingtonpost.com/asset/5ab4d4ac2000007d06eb2c56.jpeg?cache=sih0jwle4e&ops=1910_1000'
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              /> */}
            </div>
          </div>
          {/* </DialogContentText> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => props.setOpenEditModalActionCreator(false)}>Cancel</Button>
          {renderUploadButton()}
        </DialogActions>
      </Dialog>
    </div>
  );
};

const mapStateToProps = (state) => {
  return { modalState: state.modalState, imageState: state.imageState };
};

export default connect(mapStateToProps, {
  setOpenEditModalActionCreator,
  setImageActionCreator,
  updateUserImageActionCreator,
})(EditUserInfo);
