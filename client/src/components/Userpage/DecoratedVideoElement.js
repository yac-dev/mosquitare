import React, { forwardRef } from 'react';
import VideoElement from './VideoElement';

const DecoratedVideoElement = forwardRef((props, ref) => {
  return <VideoElement {...props} forwardedRef={ref} />;
});

export default DecoratedVideoElement;
