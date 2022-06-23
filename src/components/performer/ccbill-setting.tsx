import { PureComponent } from 'react';
import {
  Form, Input, Button, message
} from 'antd';

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

const validateMessages = {
  required: 'This field is required!'
};

interface IProps {
  onFinish: Function;
  ccbillSetting?: any;
  submiting?: boolean;
}

export class CCbillSettingForm extends PureComponent<IProps> {
  render() {
    const { ccbillSetting, onFinish, submiting } = this.props;
    return (
      <Form
        {...layout}
        layout="vertical"
        name="form-performer"
        onFinish={onFinish.bind(this)}
        onFinishFailed={() => message.error('Please complete the required fields.')}
        validateMessages={validateMessages}
        initialValues={
          ccbillSetting
            ? {
              ...ccbillSetting.value
            }
            : ({
              subAccountNumber: '',
              flexformId: '',
              salt: ''
            })
        }
      >

        <Form.Item
          name="subscriptionSubAccountNumber"
          label="Subscription sub-account number"
          rules={[{ required: true, message: 'Please enter sub account number' }]}
        >
          <Input placeholder="Enter subscription sub-account number" />
        </Form.Item>
        <Form.Item
          name="singlePurchaseSubAccountNumber"
          label="Single purchase sub-account number"
        >
          <Input placeholder="Enter single purchase sub-account number" />
        </Form.Item>
        <Form.Item
          name="flexformId"
          label="Flex form Id"
          rules={[{ required: true, message: 'Please enter flex form Id' }]}
        >
          <Input placeholder="Enter flex form Id" />
        </Form.Item>
        <Form.Item name="salt" label="Salt key" help="Contact CCbill supporter to get it if you don't know">
          <Input placeholder="Enter salt key" />
        </Form.Item>
        <Form.Item className="text-center">
          <Button type="primary" htmlType="submit" disabled={submiting} loading={submiting}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  }
}
