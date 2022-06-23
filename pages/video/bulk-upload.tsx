import { PureComponent, createRef } from 'react';
import Head from 'next/head';
import {
  Layout, Form, message, Button, Select, Upload, Switch, InputNumber,
  DatePicker, Row, Col, Avatar
} from 'antd';
import Page from '@components/common/layout/page';
import { FormInstance } from 'antd/lib/form';
import { formatDate } from '@lib/index';
import { UploadOutlined } from '@ant-design/icons';
import VideoUploadList from '@components/file/video-upload-list';
import { SelectPerformerDropdown } from '@components/performer/common/select-performer-dropdown';
import { videoService, performerService, getGlobalConfig } from '@services/index';
import Router from 'next/router';
import moment from 'moment';
import { BreadcrumbComponent } from '@components/common';
import { uniqBy, debounce } from 'lodash';

interface IProps { }

const validateMessages = {
  required: 'This field is required!'
};

const { Dragger } = Upload;

class BulkUploadVideo extends PureComponent<IProps> {
  state = {
    isSaleVideo: false,
    isSchedule: false,
    scheduledAt: moment().add(1, 'day'),
    uploading: false,
    fileList: [],
    performers: []
  };

  formRef: any;

  componentDidMount() {
    this.getPerformers('', '');
  }

  onUploading(file, resp: any) {
    // eslint-disable-next-line no-param-reassign
    file.percent = resp.percentage;
    // eslint-disable-next-line no-param-reassign
    if (file.percent === 100) file.status = 'done';
    this.forceUpdate();
  }

  getPerformers = debounce(async (q, performerIds) => {
    try {
      const resp = await (await performerService.search({ q, performerIds: performerIds || '', limit: 500 })).data;
      const performers = resp.data || [];
      this.setState({ performers });
    } catch (e) {
      const err = await e;
      message.error(err?.message || 'Error occured');
    }
  }, 500);

  setFormVal(field: string, val: any) {
    const instance = this.formRef.current as FormInstance;
    instance.setFieldsValue({
      [field]: val
    });
  }

  beforeUpload(file, files) {
    const isValid = file.size / 1024 / 1024 < (getGlobalConfig().NEXT_PUBLIC_MAX_SIZE_VIDEO || 2000);
    if (!isValid) {
      message.error(`File ${file.name} is too large`);
      // eslint-disable-next-line no-param-reassign
      files = files.filter((f) => f.uid === file.uid);
    }
    const { fileList } = this.state;
    this.setState({ fileList: uniqBy([...fileList, ...files], ((f) => f.name && f.size)) });
  }

  remove(file) {
    const { fileList } = this.state;
    this.setState({ fileList: fileList.filter((f) => f.uid !== file.uid) });
  }

  async submit(formValues) {
    const {
      fileList, isSaleVideo, isSchedule, scheduledAt
    } = this.state;
    if (!formValues.performerId) {
      message.error('Please select model!');
      return;
    }
    if (!fileList.length) {
      message.error('Please select video!');
      return;
    }
    const uploadFiles = fileList.filter(
      (f) => !['uploading', 'done'].includes(f.status)
    );
    if (!uploadFiles.length) {
      message.error('Please select new video!');
      return;
    }

    await this.setState({ uploading: true });
    // eslint-disable-next-line no-restricted-syntax
    for (const file of uploadFiles) {
      try {
        // eslint-disable-next-line no-continue
        if (['uploading', 'done'].includes(file.status)) continue;
        const payload = {
          ...formValues,
          title: file.name || `video ${formatDate(new Date(), 'DD MMM YYYY')}`,
          isSaleVideo,
          isSchedule,
          scheduledAt
        };
        if (payload.tags && payload.tags.length) {
          payload.tags = Array.isArray(payload.tags) ? payload.tags : [payload.tags];
          payload.tags = payload.tags.map((t) => t.replace(/\s+/g, '_').toLowerCase());
        } else delete payload.tags;
        // if (payload.categoryIds && payload.categoryIds.length) {
        //   payload.categoryIds = Array.isArray(payload.categoryIds) ? payload.categoryIds : [payload.categoryIds];
        // } else delete payload.categoryIds;
        if (payload.participantIds && payload.participantIds.length) {
          payload.participantIds = Array.isArray(payload.participantIds) ? payload.participantIds : [payload.participantIds];
        } else delete payload.participantIds;
        // eslint-disable-next-line no-await-in-loop
        await videoService.uploadVideo(
          [
            {
              fieldname: 'video',
              file
            }
          ],
          payload,
          this.onUploading.bind(this, file)
        );
      } catch (e) {
        message.error(`File ${file.name} error!`);
      }
    }
    message.success('Uploaded successfully!');
    Router.push('/video');
  }

  render() {
    if (!this.formRef) this.formRef = createRef();
    const {
      uploading, fileList, isSaleVideo, isSchedule, scheduledAt, performers
    } = this.state;
    return (
      <Layout>
        <Head>
          <title>Bulk Upload Videos</title>
        </Head>
        <Page>
          <BreadcrumbComponent breadcrumbs={[{ title: 'Videos', href: '/video' }, { title: 'Bulk upload videos' }]} />
          <Form
            className="account-form"
            layout="vertical"
            onFinish={this.submit.bind(this)}
            validateMessages={validateMessages}
            ref={this.formRef}
            initialValues={{
              status: 'inactive',
              performerIds: [],
              tags: [],
              categoryIds: [],
              isSaleVideo: false,
              isSchedule: false,
              price: 9.99
            }}
          >
            <Row>
              <Col md={12} xs={12}>
                <Form.Item name="performerId" label="Model">
                  <SelectPerformerDropdown
                    noEmpty
                    defaultValue=""
                    onSelect={(val) => this.setFormVal('performerId', val)}
                  />
                </Form.Item>
              </Col>
              <Col md={12} xs={12}>
                <Form.Item label="Tags" name="tags">
                  <Select
                    onChange={(val) => this.setFormVal('tags', val)}
                    mode="tags"
                    style={{ width: '100%' }}
                    size="middle"
                    showArrow={false}
                    defaultActiveFirstOption={false}
                    placeholder="Add Tags"
                  />
                </Form.Item>
              </Col>
              <Col md={12} xs={12}>
                <Form.Item
                  label="Participants"
                  name="participantIds"
                >
                  <Select
                    mode="multiple"
                    style={{ width: '100%' }}
                    showSearch
                    placeholder="Search performers here"
                    optionFilterProp="children"
                    onSearch={this.getPerformers.bind(this)}
                    loading={uploading}
                  >
                    {performers.map((p) => (
                      <Select.Option key={p._id} value={p._id}>
                        <Avatar style={{ width: 24, height: 24 }} src={p?.avatar || '/no-avatar.png'} />
                        {' '}
                        {p?.name || p?.username || 'N/A'}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col md={12} xs={12}>
                <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Please select status!' }]}>
                  <Select>
                    <Select.Option key="active" value="active">
                      Active
                    </Select.Option>
                    <Select.Option key="inactive" value="inactive">
                      Inactive
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col md={12} xs={12}>
                <Form.Item name="isSale" label="For sale?" valuePropName="checked">
                  <Switch unCheckedChildren="Subscribe to view" checkedChildren="Pay per view" onChange={(checked) => this.setState({ isSaleVideo: checked })} />
                </Form.Item>
              </Col>
              {isSaleVideo && (
              <Col md={12} xs={12}>
                <Form.Item name="price" label="Price">
                  <InputNumber style={{ width: '100%' }} min={1} />
                </Form.Item>
              </Col>
              )}
              <Col md={12} xs={12}>
                <Form.Item name="isSchedule" label="Schedule?" valuePropName="checked">
                  <Switch unCheckedChildren="Recent" checkedChildren="Upcoming" onChange={(checked) => this.setState({ isSchedule: checked })} />
                </Form.Item>
              </Col>
              {isSchedule && (
              <Col md={12} xs={12}>
                <Form.Item label="Upcoming at">
                  <DatePicker
                    style={{ width: '100%' }}
                    disabledDate={(currentDate) => currentDate && currentDate < moment().endOf('day')}
                    defaultValue={scheduledAt}
                    onChange={(date) => this.setState({ scheduledAt: date })}
                  />
                </Form.Item>
              </Col>
              )}
            </Row>
            <Form.Item>
              <Dragger
                customRequest={() => false}
                accept="video/*,.mkv"
                beforeUpload={this.beforeUpload.bind(this)}
                multiple
                showUploadList={false}
                disabled={uploading}
                listType="picture"
              >
                <p className="ant-upload-drag-icon">
                  <UploadOutlined />
                </p>
                <p className="ant-upload-text">Click or drag-drop files to this area to upload</p>
                <p className="ant-upload-hint">Support video format only</p>
              </Dragger>
              <VideoUploadList files={fileList} remove={this.remove.bind(this)} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={uploading} disabled={uploading || !fileList.length}>
                UPLOAD ALL
              </Button>
            </Form.Item>
          </Form>
        </Page>
      </Layout>
    );
  }
}

export default BulkUploadVideo;
