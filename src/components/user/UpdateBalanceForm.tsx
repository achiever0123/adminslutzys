import React from 'react';
import { Form, Button, InputNumber } from 'antd';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 }
};

interface Iprops {
  onFinish : Function,
  balance: number,
  updating: boolean
}

export const UpdateBalanceForm = ({ onFinish, balance, updating = false }: Iprops) => (
  <Form
    name="nest-messages"
    onFinish={onFinish.bind(this)}
    {...layout}
    initialValues={{
      balance
    }}
  >
    <Form.Item
      name="balance"
      label="Balance"
      rules={[
        { required: true, message: 'Enter balance you want to update!' }
      ]}
    >
      <InputNumber />
    </Form.Item>
    <Form.Item className="text-center">
      <Button type="primary" htmlType="submit" loading={updating}>
        Update
      </Button>
    </Form.Item>
  </Form>
);
