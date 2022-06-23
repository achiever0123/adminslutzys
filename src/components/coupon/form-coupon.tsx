import { PureComponent, createRef } from 'react';
import {
  Form, Input, Button, InputNumber, Select, DatePicker
} from 'antd';
import { ICouponCreate, ICouponUpdate } from 'src/interfaces';
import { FormInstance } from 'antd/lib/form';
import moment from 'moment';

interface IProps {
  coupon?: ICouponUpdate;
  onFinish: Function;
  submiting?: boolean;
}
function disabledDate(current) {
  return current && current < moment().endOf('day');
}
export class FormCoupon extends PureComponent<IProps> {
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
    const { coupon, onFinish, submiting } = this.props;
    return (
      <Form
        ref={this.formRef}
        onFinish={onFinish.bind(this)}
        initialValues={
          coupon
            ? { ...coupon, expiredDate: moment(coupon.expiredDate, 'YYYY-MM-DD'), value: coupon.value }
            : ({
              name: '',
              description: '',
              code: '',
              value: 0.1,
              status: 'active',
              expiredDate: '',
              numberOfUses: 1
            } as ICouponCreate)
        }
        layout="vertical"
      >
        <Form.Item name="name" rules={[{ required: true, message: 'Please input name' }]} label="Name">
          <Input placeholder="Enter coupon name" />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item name="code" label="Code" rules={[{ required: true, message: 'Please input code' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="value"
          label="Discount percentage 0.01-0.99 (1% to 99%)"
          rules={[
            { required: true, message: 'Please input discount percentage' }
          ]}
        >
          <InputNumber min={0.01} max={0.99} />
        </Form.Item>
        <Form.Item
          name="numberOfUses"
          label="Maximum number of people who can use coupon"
          rules={[{ required: true, message: 'Please input number of uses' }]}
        >
          <InputNumber style={{ width: '100%' }} min={1} />
        </Form.Item>
        <Form.Item
          name="expiredDate"
          label="Expiry Date"
          rules={[{ required: true, message: 'Please input select expiry date' }]}
        >
          <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" disabledDate={disabledDate} />
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
          <Button type="primary" htmlType="submit" loading={submiting}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  }
}
