import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Quill from 'quill';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

//css
import 'quill/dist/quill.snow.css';
// import '../styles/docEditor.css';

// ac
import { getDocByConversationIdActionCreator } from '../actionCreators/docActionCreator';

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['bold', 'italic', 'underline'],
  [{ color: [] }, { background: [] }],
  [{ script: 'sub' }, { script: 'super' }],
  [{ align: [] }],
  ['image', 'blockquote', 'code-block'],
  ['clean'],
];

const FetchedDocEditor = (props) => {
  const [quill, setQuill] = useState();
  const [deltaPosition, setDeltaPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (quill && props.conversationState) {
      props.getDocByConversationIdActionCreator().then((doc) => {
        quill.setContents(doc);
      });
    }
  }, [quill, props.conversationState]);

  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return;

    wrapper.innerHTML = '';
    const editor = document.createElement('div');
    wrapper.append(editor);

    const q = new Quill(editor, {
      theme: 'snow',
      modules: { toolbar: TOOLBAR_OPTIONS },
    });
    q.disable();
    q.setText('Loading...');
    setQuill(q);
  }, []);

  const handleDrag = (e, ui) => {
    const { x, y } = deltaPosition;
    setDeltaPosition({ ...deltaPosition, x: x + ui.deltaX, y: y + ui.deltaY });
  };

  return (
    <Draggable onDrag={handleDrag} cancel='.shared-doc-close-button, .doc-editor'>
      <div
        className={`fetched-doc-editor-component ${props.openFetchedDocEditor ? undefined : 'hidden'}`}
        style={{
          maxHeight: '70vh',
          width: '40vw',
          color: 'white',
          backgroundColor: 'rgb(37, 95, 184)',
          position: ' absolute',
          top: '80px',
          left: '10px',
          zIndex: '10',
          borderRadius: '5px',
          cursor: ' grab',
        }}
      >
        <div className='doc-editor-wrapper' style={{ display: 'flex', height: '10%' }}>
          <div
            className='fetched-doc-editor-header'
            style={{ display: 'flex', alignItems: 'center', gap: ' 5px', width: '100%', flex: 4 }}
          >
            {/* <div className='shared-doc-close-button' onClick={() => props.setOpenFetchedDocEditor(false)}> */}
            <i
              className='fa fa-close'
              style={{ color: 'red', cursor: 'pointer' }}
              onClick={() => props.setOpenFetchedDocEditor(false)}
            ></i>
            <p style={{ fontSize: '20px' }}>
              Shared Doc&nbsp;
              <InsertDriveFileIcon />
            </p>
            {/* </div> */}
          </div>
        </div>
        <div
          className='fetched-doc-editor'
          ref={wrapperRef}
          style={{
            height: ' 400px',
            backgroundColor: 'rgb(232, 232, 232)',
            color: ' black',
            overflow: 'auto',
            borderBottomLeftRadius: '5px',
            borderBottomRightRadius: '5px',
          }}
        ></div>
      </div>
    </Draggable>
  );
};

const mapStateToProps = (state) => {
  return { docState: state.docState, conversationState: state.conversationState };
};

export default connect(mapStateToProps, { getDocByConversationIdActionCreator })(FetchedDocEditor);
