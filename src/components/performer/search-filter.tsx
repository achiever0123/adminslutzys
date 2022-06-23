import React, { PureComponent } from 'react';
import {
  Input, Row, Col, Select
} from 'antd';

interface IProps {
  onSubmit: Function;
}

export class SearchFilter extends PureComponent<IProps> {
  state = {
    q: '',
    gender: '',
    status: ''
  };

  render() {
    const { onSubmit } = this.props;
    return (
      <Row gutter={24}>
        <Col lg={6} md={8} xs={12}>
          <Input
            placeholder="Enter keyword"
            onChange={(evt) => this.setState({ q: evt.target.value })}
            onPressEnter={() => onSubmit(this.state)}
          />
        </Col>
        <Col lg={6} md={8} xs={12}>
          <Select
            defaultValue=""
            style={{ width: '100%' }}
            onChange={(status) => this.setState({ status }, () => onSubmit(this.state))}
          >
            <Select.Option value="">Status</Select.Option>
            <Select.Option value="active">Active</Select.Option>
            <Select.Option value="inactive">Inactive</Select.Option>
            <Select.Option value="pending-email-confirmation">
              Pending Email Confirmation
            </Select.Option>
          </Select>
        </Col>
        <Col lg={6} md={8} xs={12}>
          <Select
            defaultValue=""
            style={{ width: '100%' }}
            onChange={(gender) => this.setState({ gender }, () => onSubmit(this.state))}
          >
            <Select.Option value="">Gender</Select.Option>
            <Select.Option key="male" value="male">
            Heterosexual
            </Select.Option>
            <Select.Option key="female" value="female">
            Homosexual
            </Select.Option>
            <Select.Option key="transgender" value="transgender">
            Bisexual
            </Select.Option>
          </Select>
        </Col>
      </Row>
    );
  }
}
