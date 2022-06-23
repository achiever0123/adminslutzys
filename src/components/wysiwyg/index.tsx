import { PureComponent } from 'react';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

// function uploadImageCallBack(file) {
//   return new Promise((resolve, reject) => {
//     const xhr = new XMLHttpRequest();
//     xhr.open('POST', 'https://api.imgur.com/3/image');
//     xhr.setRequestHeader('Authorization', 'Client-ID XXXXX');
//     const data = new FormData();
//     data.append('image', file);
//     xhr.send(data);
//     xhr.addEventListener('load', () => {
//       const response = JSON.parse(xhr.responseText);
//       resolve(response);
//     });
//     xhr.addEventListener('error', () => {
//       const error = JSON.parse(xhr.responseText);
//       reject(error);
//     });
//   });
// }

interface IProps {
  onChange?: Function;
  html?: string;
}

interface IState {
  editorState: any;
}

export default class WYSIWYG extends PureComponent<IProps, IState> {
  constructor(props: any) {
    super(props);
    const { html } = this.props;
    if (html) {
      const blocksFromHtml = htmlToDraft(html);
      const { contentBlocks, entityMap } = blocksFromHtml;
      const contentState = ContentState.createFromBlockArray(
        contentBlocks,
        entityMap
      );
      this.state = {
        editorState: EditorState.createWithContent(contentState)
      };
    } else {
      this.state = {
        editorState: EditorState.createEmpty()
      };
    }
  }

  onEditorStateChange: Function = (editorState) => {
    const { onChange } = this.props;
    onChange && onChange({
      html: draftToHtml(convertToRaw(editorState.getCurrentContent()))
    });

    this.setState({
      editorState
    });
  };

  render() {
    const { editorState } = this.state;
    return (
      <div className="editor">
        <Editor
          editorState={editorState}
          wrapperClassName="wysityg-wrapper"
          editorClassName="wysityg-editor"
          onEditorStateChange={this.onEditorStateChange}
          toolbar={{
            // image: {
            //   uploadCallback: uploadImageCallBack,
            //   alt: { present: true, mandatory: true }
            // }
          }}
        />
      </div>
    );
  }
}
