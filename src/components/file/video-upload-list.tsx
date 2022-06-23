import { PureComponent } from 'react';
import { FileDoneOutlined, DeleteOutlined } from '@ant-design/icons';
import { Progress } from 'antd';
import './index.less';

interface IProps {
  remove: Function;
  files: any[];
}

export default class VideoUploadList extends PureComponent<IProps> {
  render() {
    const { files, remove } = this.props;
    return (
      <div className="ant-upload-list ant-upload-list-picture">
        {files.map((file) => (
          <div
            className="ant-upload-list-item ant-upload-list-item-uploading ant-upload-list-item-list-type-picture"
            key={file.uid}
          >
            <div className="video-upload-item">
              <span>
                <FileDoneOutlined />
                <span>
                  <b>{`${file.name} | ${(file.size / (1024 * 1024)).toFixed(2)}MB`}</b>
                </span>
              </span>
              {file.percent !== 100 && (
                <a aria-hidden onClick={remove.bind(this, file)}>
                  <DeleteOutlined />
                </a>
              )}
            </div>
            {file.percent && (
              <Progress percent={Math.round(file.percent)} />
            )}
          </div>
        ))}
      </div>
    );
  }
}
