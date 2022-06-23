import { PureComponent, createRef } from 'react';
import {
  Form, Input, Button, Select
} from 'antd';
import { IGalleryCreate, IGalleryUpdate } from 'src/interfaces';
import { SelectPerformerDropdown } from '@components/performer/common/select-performer-dropdown';
import { FormInstance } from 'antd/lib/form';

interface IProps {
  gallery?: IGalleryUpdate;
  onFinish: Function;
  submiting: boolean;
}

export class FormGallery extends PureComponent<IProps> {
  formRef: any;

  componentDidMount() {
    if (!this.formRef) this.formRef = createRef();
  }

  setFormVal(field: string, val: any) {
    const instance = this.formRef.current as FormInstance;
    instance.setFieldsValue({
      [field]: val
    });
  }

  render() {
    if (!this.formRef) this.formRef = createRef();
    const { gallery, onFinish, submiting } = this.props;
    return (
      <Form
        ref={this.formRef}
        onFinish={onFinish.bind(this)}
        initialValues={
          gallery || ({
            name: '',
            description: '',
            status: 'active',
            performerId: ''
          } as IGalleryCreate)
        }
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <Form.Item name="performerId" label="Performer" rules={[{ required: true }]}>
          <SelectPerformerDropdown
            noEmpty
            defaultValue={gallery && gallery.performerId}
            onSelect={(val) => this.setFormVal('performerId', val)}
          />
        </Form.Item>
        <Form.Item name="name" rules={[{ required: true, message: 'Please input title of gallery!' }]} label="Name">
          <Input placeholder="Enter gallery name" />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea rows={3} />
        </Form.Item>
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
        <Button type="primary" htmlType="submit" disabled={submiting} loading={submiting}>
          Submit
        </Button>
      </Form>
    );
  }
}
