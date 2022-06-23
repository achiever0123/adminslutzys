import React from 'react';
import { Form, Button, Input } from 'antd';

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

interface IProps {
  onFinish: Function;
  updating: boolean;
}

export const UpdatePaswordForm = ({ onFinish, updating = false }: IProps) => (
  <Form name="nest-messages" onFinish={onFinish.bind(this)} {...layout}>
    <Form.Item
      name="password"
      label="Password"
      rules={[
        { required: true, message: 'Please input your password!' },
        { min: 8, message: 'Enter password of at least 8 characters' }
      ]}
    >

      <Input.Password placeholder="Enter password of at least 8 characters" />
    </Form.Item>
    <Form.Item
      name="passwordConfirm"
      label="Confirm Password"
      rules={[
        { required: true, message: 'Please input your confirm password!' },
        { min: 8, message: 'Enter password of at least 8 characters' },
        ({ getFieldValue }) => ({
          validator(rule, value) {
            if (!value || getFieldValue('password') === value) {
              return Promise.resolve();
            }
            // eslint-disable-next-line prefer-promise-reject-errors
            return Promise.reject('Passwords do not match!');
          }
        })
      ]}
    >
      <Input.Password placeholder="Enter confirm password of at least 8 characters" />
    </Form.Item>

    <Form.Item className="text-center">
      <Button type="primary" htmlType="submit" loading={updating}>
        Update
      </Button>
    </Form.Item>
  </Form>
);
