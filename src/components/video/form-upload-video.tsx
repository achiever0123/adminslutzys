/* eslint-disable jsx-a11y/label-has-associated-control */
import { PureComponent, createRef } from 'react';
import {
  Form, Input, Select, Upload, Button, message, Progress, Switch, DatePicker,
  Col, Row, InputNumber, Avatar
} from 'antd';
import { IVideo } from 'src/interfaces';
import { CameraOutlined, VideoCameraAddOutlined, FileAddOutlined } from '@ant-design/icons';
import { SelectPerformerDropdown } from '@components/performer/common/select-performer-dropdown';
import { performerService, getGlobalConfig } from '@services/index';
import { FormInstance } from 'antd/lib/form';
import moment from 'moment';
import { debounce } from 'lodash';

interface IProps {
  video?: IVideo;
  submit: Function;
  beforeUpload: Function;
  uploading: boolean;
  uploadPercentage: number;
}

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

export class FormUploadVideo extends PureComponent<IProps> {
  state = {
    previewThumbnail: null,
    previewVideo: null,
    previewTeaserVideo: null,
    isSaleVideo: false,
    isSchedule: false,
    scheduledAt: moment().add(1, 'day'),
    selectedVideo: null,
    selectedThumbnail: null,
    selectedTeaser: null,
    firstLoadPerformer: false,
    performers: []
  };

  formRef: any;

  componentDidMount() {
    if (!this.formRef) this.formRef = createRef();
    const { video } = this.props;
    if (video) {
      this.setState(
        {
          previewThumbnail: video?.thumbnail?.url || video?.thumbnail?.thumbnails[0] || '',
          previewVideo: video?.video?.url || '',
          isSaleVideo: video.isSaleVideo,
          previewTeaserVideo: video?.teaser?.url || '',
          isSchedule: video.isSchedule,
          scheduledAt: video.scheduledAt || moment().add(1, 'day')
        }
      );
    }
    this.getPerformers('', video?.participantIds || '');
  }

  getPerformers = debounce(async (q, performerIds) => {
    try {
      const resp = await (await performerService.search({ q, performerIds: performerIds || '', limit: 500 })).data;
      const performers = resp.data || [];
      this.setState({ performers, firstLoadPerformer: true });
    } catch (e) {
      const err = await e;
      message.error(err?.message || 'Error occured');
      this.setState({ firstLoadPerformer: true });
    }
  }, 500);

  setFormVal(field: string, val: any) {
    const instance = this.formRef.current as FormInstance;
    instance.setFieldsValue({
      [field]: val
    });
  }

  beforeUpload(file: File, field: string) {
    const { beforeUpload: beforeUploadHandler } = this.props;
    let maxSize = getGlobalConfig().NEXT_PUBLIC_MAX_SIZE_FILE || 100;
    switch (field) {
      case 'thumbnail':
        maxSize = getGlobalConfig().NEXT_PUBLIC_MAX_SIZE_IMAGE || 5;
        break;
      case 'teaser': maxSize = getGlobalConfig().NEXT_PUBLIC_MAX_SIZE_TEASER || 200;
        break;
      case 'video': maxSize = getGlobalConfig().NEXT_PUBLIC_MAX_SIZE_VIDEO || 2048;
        break;
      default: break;
    }
    const valid = file.size / 1024 / 1024 < maxSize;
    if (!valid) {
      // eslint-disable-next-line no-nested-ternary
      message.error(`${field === 'thumbnail' ? 'Thumbnail' : field === 'teaser' ? 'Teaser' : 'Video'} must be smaller than ${maxSize}MB!`);
      return false;
    }
    if (field === 'thumbnail') this.setState({ selectedThumbnail: file });
    if (field === 'teaser') this.setState({ selectedTeaser: file });
    if (field === 'video') this.setState({ selectedVideo: file });
    beforeUploadHandler(file, field);
    return true;
  }

  render() {
    if (!this.formRef) this.formRef = createRef();
    const {
      video, submit, uploading, uploadPercentage = 0
    } = this.props;
    const {
      previewThumbnail, previewVideo, isSchedule, previewTeaserVideo, scheduledAt,
      selectedTeaser, selectedThumbnail, selectedVideo, isSaleVideo, performers, firstLoadPerformer
    } = this.state;
    return (
      <Form
        {...layout}
        onFinish={(values) => {
          const data = { ...values };
          if (data.status === 'file-error') {
            message.error('Video file is on error, please upload new one');
            return;
          }
          if (data.isSchedule) {
            data.scheduledAt = scheduledAt;
          }
          if (data.tags && data.tags.length) {
            data.tags = data.tags.map((t) => t.replace(/\s+/g, '_').toLowerCase());
          }
          submit(data);
        }}
        name="form-upload"
        ref={this.formRef}
        initialValues={
          video || ({
            title: '',
            price: 1,
            description: '',
            status: 'active',
            performerId: '',
            tags: [],
            categoryIds: [],
            isSaleVideo: false,
            participantIds: [],
            isSchedule: false
          })
        }
      >
        <Form.Item name="performerId" label="Model">
          <SelectPerformerDropdown
            noEmpty
            defaultValue={video && video.performerId}
            onSelect={(val) => this.setFormVal('performerId', val)}
          />
        </Form.Item>
        <Form.Item name="title" label="Title">
          <Input placeholder="Enter video title" />
        </Form.Item>
        <Form.Item label="Tags" name="tags">
          <Select
            defaultValue={video && video.tags}
            onChange={(val) => this.setFormVal('tags', val)}
            mode="tags"
            style={{ width: '100%' }}
            size="middle"
            showArrow={false}
            defaultActiveFirstOption={false}
            placeholder="Add Tags"
          />
        </Form.Item>
        <Form.Item
          label="Participants"
          name="participantIds"
        >
          {firstLoadPerformer && (
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            showSearch
            placeholder="Search performers here"
            optionFilterProp="children"
            onSearch={this.getPerformers.bind(this)}
            loading={uploading}
          >
            {performers
              && performers.length > 0
              && performers.map((p) => (
                <Select.Option key={p._id} value={p._id}>
                  <Avatar src={p?.avatar || '/no-avatar.png'} />
                  {' '}
                  {p?.name || p?.username || 'N/A'}
                </Select.Option>
              ))}
          </Select>
          )}
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item name="isSaleVideo" label="PPV?" valuePropName="checked">
          <Switch unCheckedChildren="Subscribe to view" checkedChildren="Pay per view" onChange={(val) => this.setState({ isSaleVideo: val })} />
        </Form.Item>
        {isSaleVideo && (
          <Form.Item name="price" label="Price">
            <InputNumber min={1} />
          </Form.Item>
        )}
        <Form.Item name="isSchedule" label="Scheduled?" valuePropName="checked">
          <Switch unCheckedChildren="Recent" checkedChildren="Upcoming" onChange={(checked) => this.setState({ isSchedule: checked })} />
        </Form.Item>
        {isSchedule && (
          <Form.Item label="Scheduled for">
            <DatePicker
              style={{ width: '100%' }}
              disabledDate={(currentDate) => currentDate && currentDate < moment().endOf('day')}
              defaultValue={video && video.scheduledAt ? moment(video.scheduledAt) : moment().add(1, 'day')}
              onChange={(date) => this.setState({ scheduledAt: date })}
            />
          </Form.Item>
        )}
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
        <Row>
          <Col lg={8} xs={24}>
            <Form.Item
              label="Video"
              help={(selectedVideo && <a>{selectedVideo.name}</a>)
                || (previewVideo && <a href={previewVideo} target="_blank" rel="noreferrer">Click here to preview</a>)
                || `Video file is ${getGlobalConfig().NEXT_PUBLIC_MAX_SIZE_VIDEO || 2048}MB or below`}
            >
              <Upload
                customRequest={() => false}
                listType="picture-card"
                className="avatar-uploader"
                accept="video/*"
                multiple={false}
                showUploadList={false}
                disabled={uploading}
                beforeUpload={(file) => this.beforeUpload(file, 'video')}
              >
                {selectedVideo ? <FileAddOutlined /> : <VideoCameraAddOutlined />}
              </Upload>
            </Form.Item>
          </Col>
          <Col lg={8} xs={24}>
            <Form.Item
              label="Thumbnail"
              help={(selectedThumbnail && <a>{selectedThumbnail.name}</a>)
                || (previewThumbnail && <p><a href={previewThumbnail} target="_blank" rel="noreferrer">Click here to preview</a></p>)
                || `Thumbnail is ${getGlobalConfig().NEXT_PUBLIC_MAX_SIZE_IMAGE || 5}MB or below`}
            >
              <Upload
                customRequest={() => false}
                listType="picture-card"
                className="avatar-uploader"
                accept="image/*"
                multiple={false}
                showUploadList={false}
                disabled={uploading}
                beforeUpload={(file) => this.beforeUpload(file, 'thumbnail')}
              >
                {selectedThumbnail ? <FileAddOutlined /> : <CameraOutlined />}
              </Upload>
            </Form.Item>
          </Col>
          <Col lg={8} xs={24}>
            <Form.Item
              label="Teaser"
              help={
                (selectedTeaser && <a>{selectedTeaser.name}</a>)
                || (previewTeaserVideo && <p><a href={previewTeaserVideo} target="_blank" rel="noreferrer">Click here to preview</a></p>)
                || `Teaser is ${getGlobalConfig().NEXT_PUBLIC_MAX_SIZE_TEASER || 200}MB or below`
              }
            >
              <Upload
                customRequest={() => false}
                listType="picture-card"
                className="avatar-uploader"
                accept="video/*"
                multiple={false}
                showUploadList={false}
                disabled={uploading}
                beforeUpload={(file) => this.beforeUpload(file, 'teaser')}
              >
                {selectedTeaser ? <FileAddOutlined /> : <VideoCameraAddOutlined />}
              </Upload>
            </Form.Item>
          </Col>
        </Row>
        {uploadPercentage > 0 && (
          <Progress percent={Math.round(uploadPercentage)} />
        )}
        <Form.Item className="text-center">
          <Button type="primary" htmlType="submit" loading={uploading}>
            {video ? 'Update' : 'Upload'}
          </Button>
        </Form.Item>
      </Form>
    );
  }
}
