import { PureComponent, createRef } from 'react';
import {
  Form, Button, Select, DatePicker
} from 'antd';
import { FormInstance } from 'antd/lib/form';
import { SelectPerformerDropdown } from '@components/performer/common/select-performer-dropdown';
import { SelectUserDropdown } from '@components/user/select-user-dropdown';
import moment from 'moment';

interface IProps {
  onFinish: Function;
  submiting: boolean;
}

function disabledDate(current) {
  return current && current < moment().endOf('day');
}

export class FormSubscription extends PureComponent<IProps> {
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
    const { onFinish, submiting } = this.props;
    return (
      <Form
        ref={this.formRef}
        onFinish={onFinish.bind(this)}
        initialValues={
          {
            subscriptionType: 'system',
            userId: '',
            performerId: '',
            status: 'active',
            expiredAt: ''
          }
        }
        layout="vertical"
      >
        <Form.Item name="subscriptionType" label="Type" rules={[{ required: true, message: 'Please select type!' }]}>
          <Select>
            <Select.Option key="system" value="system">
              System
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="userId" label="User" rules={[{ required: true, message: 'Please select user' }]}>
          <SelectUserDropdown onSelect={(val) => this.setFormVal('userId', val)} />
        </Form.Item>
        <Form.Item name="performerId" label="Performer" rules={[{ required: true, message: 'Please select performer' }]}>
          <SelectPerformerDropdown noEmpty onSelect={(val) => this.setFormVal('performerId', val)} />
        </Form.Item>
        <Form.Item
          name="expiredAt"
          label="Expiry Date"
          rules={[{ required: true, message: 'Please input select expiry date of subscription!' }]}
        >
          <DatePicker style={{ width: '100%' }} placeholder="YYYY-MM-DD" format="YYYY-MM-DD" disabledDate={disabledDate} />
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
        <Form.Item wrapperCol={{ span: 20, offset: 4 }}>
          <Button type="primary" htmlType="submit" disabled={submiting} loading={submiting}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  }
}
