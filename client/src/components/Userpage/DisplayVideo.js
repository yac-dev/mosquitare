import React, { useContext } from 'react';
import { connect } from 'react-redux';

import VideoContext from './contexts/VideoContext';

const DisplayVideo = () => {
  const videos = useContext(VideoContext);
  console.log(videos);
  console.log(videos.videoRef1.src);
  console.log(videos.videoRef2.src);

  // const renderVideoSrc = () => {
  //   if (videos) {
  //     return (
  //       <div className='displaying-video'>
  //         <video>
  //           <source src={videos.videoRef1.src} />
  //         </video>
  //         {/* <video>
  //       <source src={videos.video2Ref} />
  //     </video> */}
  //       </div>
  //     );
  //   }
  // };
  return (
    // <>{renderVideoSrc()}</>
    <div className='displaying-video'>
      <video>
        <source src={videos.videoRef1.src} />
      </video>
      <video>
        <source src={videos.videoRef2.src} />
      </video>
    </div>
  ); // これ、一つのvideo tagで囲うかvideo tag二使いてやるか、違いあるかね。
};

const mapStateToProps = (state) => {
  return { authState: state.authState };
};

export default connect(mapStateToProps, {})(DisplayVideo);
