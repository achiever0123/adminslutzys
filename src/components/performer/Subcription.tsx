import { PureComponent } from 'react';
import {
  Form, Button, message, InputNumber, Row, Col
} from 'antd';
import { IPerformer } from 'src/interfaces';

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

const validateMessages = {
  required: 'This field is required!'
};

interface IProps {
  onFinish: Function;
  performer: IPerformer;
  submiting?: boolean;
}

export class SubscriptionForm extends PureComponent<IProps> {
  render() {
    const { performer, onFinish, submiting } = this.props;
    return (
      <Form
        {...layout}
        name="form-performer"
        onFinish={onFinish.bind(this)}
        onFinishFailed={() => message.error('Please complete the required fields')}
        validateMessages={validateMessages}
        initialValues={
          performer || ({
            yearlyPrice: 99.99,
            monthlyPrice: 9.99
          })
        }
      >
        <Row>
          <Col xs={24} md={12}>
            <Form.Item
              key="yearly"
              name="yearlyPrice"
              label="Yearly Subscription Price in $"
              rules={[{ required: true }]}
            >
              <InputNumber min={1} />
            </Form.Item>
            <Form.Item
              key="monthly"
              name="monthlyPrice"
              label="Monthly Subscription Price in $"
              rules={[{ required: true }]}
            >
              <InputNumber min={1} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item className="text-center">
          <Button type="primary" htmlType="submit" disabled={submiting} loading={submiting}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  }
}
