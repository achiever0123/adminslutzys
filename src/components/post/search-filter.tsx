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
    status: ''
  };

  render() {
    const { onSubmit } = this.props;
    return (
      <Row gutter={24}>
        <Col xl={{ span: 4 }} md={{ span: 8 }}>
          <Input
            placeholder="Enter keyword"
            onChange={(evt) => this.setState({ q: evt.target.value })}
            onPressEnter={() => onSubmit(this.state)}
          />
        </Col>
        <Col xl={{ span: 4 }} md={{ span: 8 }}>
          <Select defaultValue="" style={{ width: '100%' }} onChange={(status) => this.setState({ status })}>
            <Select.Option value="">All</Select.Option>
            <Select.Option value="published">Active</Select.Option>
            <Select.Option value="draft">Inactive</Select.Option>
          </Select>
        </Col>
        <Col xl={{ span: 4 }} md={{ span: 8 }}>
          <Button type="primary" onClick={() => onSubmit(this.state)}>
            Search
          </Button>
        </Col>
      </Row>
    );
  }
}
