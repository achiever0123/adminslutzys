import React, { PureComponent } from 'react';
import {
  Button, Input, Row, Col, Select
} from 'antd';

interface IProps {
  onSubmit: Function;
}

export class SearchFilter extends PureComponent<IProps> {
  state = {
    q: '',
    role: '',
    status: ''
  }

  render() {
    const { onSubmit } = this.props;
    return (
      <Row gutter={24}>
        <Col lg={8} md={8} xs={24}>
          <Input
            placeholder="Enter keyword"
            onChange={(evt) => this.setState({ q: evt.target.value })}
            onPressEnter={() => onSubmit(this.state)}
          />
        </Col>
        <Col lg={8} md={8} xs={24}>
          <Select
            defaultValue=""
            style={{ width: '100%' }}
            onChange={(role) => this.setState({ role }, () => onSubmit(this.state))}
          >
            <Select.Option value="">All role</Select.Option>
            <Select.Option value="admin">Admin</Select.Option>
            <Select.Option value="user">User</Select.Option>
          </Select>
        </Col>
        <Col lg={8} md={8} xs={24}>
          <Select
            defaultValue=""
            style={{ width: '100%' }}
            onChange={(status) => this.setState({ status }, () => onSubmit(this.state))}
          >
            <Select.Option value="">All status</Select.Option>
            <Select.Option value="active">Active</Select.Option>
            <Select.Option value="inactive">Inactive</Select.Option>
            <Select.Option value="pending-email-confirmation">Pending Email Confirmation</Select.Option>
          </Select>
        </Col>
      </Row>
    );
  }
}
