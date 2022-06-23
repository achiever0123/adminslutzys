import { PureComponent } from 'react';
import {
  Row, Col, Select, Input
} from 'antd';

interface IProps {
  onSubmit: Function;
}

const deliveryStatuses = [
  {
    key: '',
    text: 'All delivery statuses'
  },
  {
    key: 'created',
    text: 'Created'
  },
  {
    key: 'shipping',
    text: 'Shipping'
  },
  {
    key: 'delivered',
    text: 'Delivered'
  },
  {
    key: 'refunded',
    text: 'Refunded'
  }
];

export class OrderSearchFilter extends PureComponent<IProps> {
  render() {
    const { onSubmit } = this.props;
    return (
      <Row gutter={24}>
        <Col lg={6} md={8} xs={12}>
          <Input
            placeholder="Enter keyword"
            onChange={(evt) => this.setState({ q: evt.target.value })}
            onPressEnter={() => onSubmit(this.state, () => onSubmit(this.state))}
          />
        </Col>
        <Col lg={6} md={8} xs={12}>
          <Select
            onChange={(val) => this.setState({ deliveryStatus: val }, () => onSubmit(this.state))}
            style={{ width: '100%' }}
            placeholder="Select delivery status"
            defaultValue=""
          >
            {deliveryStatuses.map((s) => (
              <Select.Option key={s.key} value={s.key}>
                {s.text || s.key}
              </Select.Option>
            ))}
          </Select>
        </Col>
      </Row>
    );
  }
}
