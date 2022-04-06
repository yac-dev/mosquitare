import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Quill from 'quill';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';

//css
import 'quill/dist/quill.snow.css';
import '../styles/docEditor.css';

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
    if (props.conversationState) {
      // ここでdocをconversation Idで引っ張ってくる。
      props.getDocByConversationIdActionCreator();
    }
  }, [props.conversationState]);

  useEffect(() => {
    if (quill && props.docState) {
      // props.docState.docNow.data.ops.map((data) => {
      //   return quill.setContents(data.insert);
      // });
      quill.setContents(props.docState.docNow.data);
    }
  }, [props.docState]);

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
      <div className={`doc-editor-component ${props.openFetchedDocEditor ? undefined : 'hidden'}`}>
        <div className='doc-editor-header'>
          <p>Shared Doc</p>
          <div className='shared-doc-close-button' onClick={() => props.setOpenFetchedDocEditor(false)}>
            <i className='fa fa-close' style={{ fontSize: '12px', color: 'white' }}></i>
          </div>
        </div>
        <div className='doc-editor' ref={wrapperRef}></div>
      </div>
    </Draggable>
  );
};

const mapStateToProps = (state) => {
  return { docState: state.docState, conversationState: state.conversationState };
};

export default connect(mapStateToProps, { getDocByConversationIdActionCreator })(FetchedDocEditor);
