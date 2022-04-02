import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Quill from 'quill';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';

//css
import 'quill/dist/quill.snow.css';
import '../styles/docEditor.css';

// ac
import { getDocIdActionCreator } from '../actionCreators/docActionCreator';

// storyとして、まずlocalhost/にアクセスしたら、自動でuuidのidを使ったpathに行く。そのrandom idを使って、
const SAVE_INTERVAL_MS = 2000;
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

const DocEditor = (props) => {
  // const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();
  const [deltaPosition, setDeltaPosition] = useState({ x: 0, y: 0 });

  // 部屋のidっていうのは、そこまで重要なことではない。要は、通信相手としてidを持っていればそれでいい。
  // そして、textEditorがrenderされた後に、get-documentのsocket eventを起こす。idをこちらから送ってね。
  useEffect(() => {
    props.socket.on('OPEN_MY_DOC', () => {
      props.setOpenDoc(true);
    });
  }, []);

  useEffect(() => {
    if (quill && props.conversationState.conversationId) {
      if (props.mediaState.amIRecieving) {
        props.socket.on('STARTED_YOUR_DOC', (dataFromServer) => {
          // docのidをもらって、redux stateに入れる。
          props.getDocIdActionCreator(dataFromServer.docId);
          quill.setContents(dataFromServer.docData);
          quill.enable();
        });
      } else if (props.mediaState.amICalling) {
        props.socket.emit('LETS_START_OUR_DOC', {
          to: props.mediaState.callingWith.socketId,
          me: props.authState.currentUser.socketId,
          conversation: props.conversationState.conversationId,
        });
        props.socket.on('STARTED_YOUR_DOC', (dataFromServer) => {
          // docのidをもらって、redux stateに入れる。
          props.getDocIdActionCreator(dataFromServer.docId);
          quill.setContents(dataFromServer.docData);
          quill.enable();
        });
      }
    }
  }, [quill, props.conversationState.conversationId]);

  useEffect(() => {
    if (quill) {
      const docChangeHandler = (delta, oldDelta, source) => {
        if (source !== 'user') return;
        props.socket.emit('SEND_DOC_CHANGE', {
          to: props.mediaState.callingWith.socketId,
          me: props.authState.currentUser._id,
          delta,
        });
      };
      quill.on('text-change', docChangeHandler);

      return () => {
        quill.off('text-change', docChangeHandler);
      };
    }
  }, [quill]);

  useEffect(() => {
    // if (socket == null || quill == null) return;
    if (quill) {
      props.socket.on('DOC_DATA_CHANGED', (dataFromServer) => {
        quill.updateContents(dataFromServer.deltaData);
      });

      return () => {
        props.socket.off('DOC_DATA_CHANGED', (dataFromServer) => {
          quill.updateContents(dataFromServer.deltaData);
        });
      };
    }
  }, [quill]);

  useEffect(() => {
    if (quill && props.docState.id) {
      const interval = setInterval(() => {
        props.socket.emit('SAVE_OUR_DOC', { docId: props.docState.id, docData: quill.getContents() });
      }, 3000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [quill, props.docState.id]);

  // useEffect(() => {
  //   if (props.docState._id) {
  //     props.socket.emit('GET_OUR_DOC', { me: props.authState.currentUser.socketId, docId: props.docState._id });
  //   }
  // }, [props.docState._id]);

  // server
  // {socket.on('load-doc', (fromClient) => { doc = awiat doc.findbyid()  emit this is your doc で、doc.dataを二人に渡す。})}

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
      <div className={`doc-editor-component ${props.openDoc ? undefined : 'hidden'}`}>
        <div className='doc-editor-header'>
          <p>Shared Doc</p>
          <div className='shared-doc-close-button' onClick={() => props.setOpenDoc(false)}>
            <i className='fa fa-close' style={{ fontSize: '12px', color: 'white' }}></i>
          </div>
        </div>
        <div className='doc-editor' ref={wrapperRef}></div>
      </div>
    </Draggable>
  );
};

const mapStateToProps = (state) => {
  return {
    docState: state.docState,
    mediaState: state.mediaState,
    authState: state.authState,
    conversationState: state.conversationState,
  };
};

export default connect(mapStateToProps, { getDocIdActionCreator })(DocEditor);
