import { Upload, message } from 'antd';
import { LoadingOutlined, FileAddOutlined } from '@ant-design/icons';
import { getGlobalConfig } from 'src/services';
import { PureComponent } from 'react';

function beforeUpload(file) {
  const isLt2M = file.size / 1024 / 1024 < (getGlobalConfig().NEXT_PUBLIC_MAX_SIZE_FILE || 20);
  if (!isLt2M) {
    message.error(`File must smaller than ${getGlobalConfig().NEXT_PUBLIC_MAX_SIZE_FILE || 20}MB!`);
  }
  return isLt2M;
}

interface IState {
  loading: boolean;
  fileUrl: string;
}

interface IProps {
  fieldName?: string;
  fileUrl?: string;
  uploadUrl?: string;
  headers?: any;
  onUploaded?: Function;
}

export class FileUpload extends PureComponent<IProps, IState> {
  state = {
    loading: false,
    fileUrl: ''
  };

  handleChange = (info) => {
    const { onUploaded } = this.props;
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      this.setState({
        loading: false,
        fileUrl: info.file.response.data ? info.file.response.data.url : 'Done!'
      });
      onUploaded
        && onUploaded({
          response: info.file.response
        });
    }
  };

  render() {
    const { loading } = this.state;
    const uploadButton = (
      <div>
        {loading ? <LoadingOutlined /> : <FileAddOutlined />}
      </div>
    );
    const { fileUrl } = this.state;
    const { headers, uploadUrl, fieldName = 'file' } = this.props;
    return (
      <Upload
        name={fieldName}
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action={uploadUrl}
        beforeUpload={beforeUpload}
        onChange={this.handleChange}
        headers={headers}
      >
        {fileUrl ? <span>Click to download</span> : uploadButton}
      </Upload>
    );
  }
}
