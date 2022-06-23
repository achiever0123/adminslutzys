import { PureComponent } from 'react';
import {
  Form, Button, message, InputNumber
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
  commissionSetting?: any;
  submiting?: boolean;
}

export class CommissionSettingForm extends PureComponent<IProps> {
  render() {
    const { commissionSetting, onFinish, submiting } = this.props;
    return (
      <Form
        {...layout}
        layout="vertical"
        name="form-performer"
        onFinish={onFinish.bind(this)}
        onFinishFailed={() => message.error('Please complete the required fields.')}
        validateMessages={validateMessages}
        initialValues={
          commissionSetting || ({
            monthlySubscriptionCommission: 0.1,
            yearlySubscriptionCommission: 0.1,
            videoSaleCommission: 0.1,
            productSaleCommission: 0.1
          })
        }
      >
        <Form.Item name="monthlySubscriptionCommission" label="Monthly Sub commission" help="Value is from 0.01 - 0.99 (1% - 99%)">
          <InputNumber min={0.01} max={0.99} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="yearlySubscriptionCommission" label="Yearly Sub commission">
          <InputNumber min={0.01} max={0.99} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="productSaleCommission" label="Product sale commission">
          <InputNumber min={0.01} max={0.99} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="videoSaleCommission" label="Video sale commission">
          <InputNumber min={0.01} max={0.99} style={{ width: '100%' }} />
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
