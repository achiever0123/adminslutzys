import { Upload, message } from 'antd';
import { LoadingOutlined, CameraOutlined } from '@ant-design/icons';
import { PureComponent } from 'react';
import { getGlobalConfig } from 'src/services';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

interface IState {
  loading: boolean;
  imageUrl: string;
}

interface IProps {
  image?: string;
  uploadUrl?: string;
  headers?: any;
  onUploaded?: Function;
  options?: any;
}

export class ImageUpload extends PureComponent<IProps, IState> {
  state = {
    loading: false,
    imageUrl: ''
  };

  handleChange = (info) => {
    const { onUploaded } = this.props;
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl) => {
        this.setState({
          imageUrl,
          loading: false
        });
        onUploaded
          && onUploaded({
            response: info.file.response,
            base64: imageUrl
          });
      });
    }
  };

  beforeUpload(file) {
    const isMaxSize = file.size / 1024 / 1024 < (getGlobalConfig().NEXT_PUBLIC_MAX_SIZE_IMAGE || 5);
    if (!isMaxSize) {
      message.error(`Image must be smaller than ${getGlobalConfig().NEXT_PUBLIC_MAX_SIZE_IMAGE || 5}MB!`);
      return false;
    }
    getBase64(file, (imageUrl) => {
      this.setState({
        imageUrl
      });
    });
    return isMaxSize;
  }

  render() {
    const { loading, imageUrl } = this.state;
    const {
      options = {}, image, headers, uploadUrl
    } = this.props;
    const uploadButton = (
      <div>
        {loading ? <LoadingOutlined /> : <CameraOutlined />}
      </div>
    );
    return (
      <Upload
        accept={'image/*'}
        name={options.fieldName || 'file'}
        listType="picture-card"
        disabled={loading}
        className="avatar-uploader"
        showUploadList={false}
        action={uploadUrl}
        beforeUpload={this.beforeUpload.bind(this)}
        onChange={this.handleChange}
        headers={headers}
      >
        {(imageUrl || image) && <img src={imageUrl || image} alt="file" style={{ width: '100%' }} />}
        {uploadButton}
      </Upload>
    );
  }
}
