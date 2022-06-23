import Head from 'next/head';
import { PureComponent, createRef } from 'react';
import {
  Form, message, Button, Select, Upload, Input, Row, Col
} from 'antd';
import Page from '@components/common/layout/page';
import { SelectPerformerDropdown } from '@components/performer/common/select-performer-dropdown';
import { FormInstance } from 'antd/lib/form';
import { UploadOutlined } from '@ant-design/icons';
import { photoService, getGlobalConfig } from '@services/index';
import { SelectGalleryDropdown } from '@components/gallery/common/select-gallery-dropdown';
import { BreadcrumbComponent } from '@components/common';
import Router from 'next/router';

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

const validateMessages = {
  required: 'This field is required!'
};

const { Dragger } = Upload;

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

interface IProps {
  galleryId: string;
}

class BulkUploadPhoto extends PureComponent<IProps> {
  state = {
    uploading: false,
    fileList: [],
    selectedPerformerId: ''
  };

  formRef: any;

  componentDidMount() {
    if (!this.formRef) this.formRef = createRef();
  }

  onUploading(file, resp: any) {
    // eslint-disable-next-line no-param-reassign
    file.percent = resp.percentage;
    this.forceUpdate();
  }

  setFormVal(field: string, val: any) {
    const instance = this.formRef.current as FormInstance;
    instance.setFieldsValue({
      [field]: val
    });
    if (field === 'performerId') this.setState({ selectedPerformerId: val });
  }

  async beforeUpload(file, fileList) {
    if (file.size / 1024 / 1024 > (getGlobalConfig().NEXT_PUBLIC_MAX_SIZE_IMAGE || 5)) {
      message.error(`${file.name} is over ${getGlobalConfig().NEXT_PUBLIC_MAX_SIZE_IMAGE || 5}MB`);
      return false;
    }
    getBase64(file, (imageUrl) => {
      // eslint-disable-next-line no-param-reassign
      file.thumbUrl = imageUrl;
    });
    this.setState({
      fileList: fileList.filter((f) => f.size / 1024 / 1024 < (getGlobalConfig().NEXT_PUBLIC_MAX_SIZE_IMAGE || 5))
    });
    return true;
  }

  remove(file) {
    const { fileList } = this.state;
    this.setState({ fileList: fileList.filter((f) => f.uid !== file.uid) });
  }

  async submit(data: any) {
    const { fileList } = this.state;
    if (!data.performerId) {
      message.error('Please select model!');
      return;
    }
    if (!data.galleryId) {
      message.error('Please select gallery!');
      return;
    }
    if (!fileList.length) {
      message.error('Please select photo!');
      return;
    }
    const uploadFiles = fileList.filter((f) => !['uploading', 'done'].includes(f.status));
    if (!uploadFiles.length) {
      message.error('Please select new file!');
      return;
    }
    await this.setState({ uploading: true });

    // eslint-disable-next-line no-restricted-syntax
    for (const file of uploadFiles) {
      try {
        // eslint-disable-next-line no-continue
        if (['uploading', 'done'].includes(file.status)) continue;
        file.status = 'uploading';
        // eslint-disable-next-line no-await-in-loop
        await photoService.uploadPhoto(file, data, this.onUploading.bind(this, file));
        file.status = 'done';
        file.response = { status: 'success' };
      } catch (e) {
        file.status = 'error';
        message.error(`File ${file.name} error!`);
      }
    }
    message.success('Photos has been uploaded!');
    Router.push('/photos');
  }

  render() {
    if (!this.formRef) this.formRef = createRef();
    const { uploading, fileList, selectedPerformerId } = this.state;
    const { galleryId } = this.props;
    return (
      <>
        <Head>
          <title>Bulk Upload Photos</title>
        </Head>
        <Page>
          <BreadcrumbComponent breadcrumbs={[{ title: 'Photos' }]} />
          <Form
            {...layout}
            onFinish={this.submit.bind(this)}
            validateMessages={validateMessages}
            ref={this.formRef}
            initialValues={{
              status: 'active',
              performerId: selectedPerformerId,
              galleryId: galleryId || ''
            }}
          >
            <Row>
              <Col md={12} xs={12}>
                <Form.Item name="performerId" label="Performer" rules={[{ required: true }]}>
                  <SelectPerformerDropdown
                    noEmpty
                    onSelect={(val) => this.setFormVal('performerId', val)}
                    disabled={uploading}
                    defaultValue=""
                  />
                </Form.Item>
              </Col>
              <Col md={12} xs={12}>
                <Form.Item
                  name="galleryId"
                  label="Gallery"
                  rules={[{ required: true, message: 'Please select a gallery' }]}
                >
                  <SelectGalleryDropdown
                    performerId={selectedPerformerId}
                    onSelect={(val) => this.setFormVal('galleryId', val)}
                    defaultValue={galleryId || ''}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="description" label="Description">
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item name="status" label="Status" rules={[{ required: true }]}>
              <Select disabled={uploading}>
                <Select.Option key="active" value="active">
                  Active
                </Select.Option>
                <Select.Option key="inactive" value="inactive">
                  Inactive
                </Select.Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Dragger
                accept="image/*"
                beforeUpload={this.beforeUpload.bind(this)}
                multiple
                showUploadList
                fileList={fileList}
                onRemove={this.remove.bind(this)}
                disabled={uploading}
                listType="picture"
              >
                <p className="ant-upload-drag-icon">
                  <UploadOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">Support image file only</p>
              </Dragger>
            </Form.Item>
            <Form.Item className="text-center">
              <Button type="primary" htmlType="submit" loading={uploading} disabled={uploading}>
                UPLOAD ALL
              </Button>
            </Form.Item>
          </Form>
        </Page>
      </>
    );
  }
}

export default BulkUploadPhoto;
