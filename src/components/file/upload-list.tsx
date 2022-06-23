/* eslint-disable no-nested-ternary */
import { PureComponent } from 'react';
import {
  DeleteOutlined, PictureOutlined
} from '@ant-design/icons';
import { Progress } from 'antd';

interface IProps {
  remove: Function;
  files: any[];
}
export default class UploadList extends PureComponent<IProps> {
  state = {
    previews: {} as any
  }

  componentDidMount() {
    this.renderPreviews();
  }

  componentDidUpdate(prevProps) {
    const { files } = this.props;
    if (prevProps?.files.length !== files.length) {
      this.renderPreviews();
    }
  }

  renderPreviews = () => {
    const { files } = this.props;
    files.forEach((file) => {
      if (file._id) return;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.addEventListener('load', () => {
        const { previews } = this.state;
        const url = reader.result as string;
        this.setState({ previews: { ...previews, [file.uid]: url } });
      });
    });
  }

  render() {
    const { files, remove } = this.props;
    const { previews } = this.state;
    return (
      <div className="ant-upload-list ant-upload-list-picture">
        {files.length > 0 && files.map((file) => (
          <div
            className="ant-upload-list-item ant-upload-list-item-uploading ant-upload-list-item-list-type-picture"
            key={file._id || file.uid}
            style={{ height: 'auto' }}
          >
            <div className="photo-upload-list">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className="photo-thumb">
                  {file._id ? <img width="60px" src={file?.photo?.thumbnails[0]} alt="thumb" /> : file.uid ? <img width="60px" alt="thumb" src={previews[file?.uid]} /> : <PictureOutlined />}
                </div>
                <div>
                  <p>{`${file?.name || file?.title} | ${((file?.size || file?.photo?.size) / (1024 * 1024)).toFixed(2)} MB`}</p>
                </div>
              </div>
              {file.percent !== 100 && (
                <a aria-hidden className="remove-photo" onClick={remove.bind(this, file)}>
                  <DeleteOutlined />
                </a>
              )}
              {file.percent && (
                <Progress percent={Math.round(file.percent)} />
              )}
              {file._id && (
                <Progress percent={100} />
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }
}
