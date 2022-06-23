import Head from 'next/head';
import React, { PureComponent } from 'react';
import Page from '@components/common/layout/page';
import {
  message, Card, Row, Col, Tag, Table
} from 'antd';
import { earningService } from '@services/earning.service';
import Loader from '@components/common/base/loader';
import { BreadcrumbComponent } from '@components/common';

interface IProps {
  id: string;
}
class EarningUpdate extends PureComponent<IProps> {
  state = {
    fetching: true,
    earning: null
  };

  static async getInitialProps({ ctx }) {
    const { query } = ctx;
    return query;
  }

  async componentDidMount() {
    const { id } = this.props;
    try {
      const resp = await earningService.findById(id);
      this.setState({ earning: resp.data });
    } catch (e) {
      message.error('Earning not found!');
    } finally {
      this.setState({ fetching: false });
    }
  }

  render() {
    const columnsProduct = [
      {
        title: 'Name',
        dataIndex: 'name'
      },
      {
        title: 'Description',
        dataIndex: 'description'
      },
      {
        title: 'Product type',
        dataIndex: 'productType',
        render(productType: string) {
          return (
            <span>
              <Tag color="green">{productType === 'performer' ? 'subscription' : productType}</Tag>
            </span>
          );
        }
      },
      {
        title: 'Total Price',
        dataIndex: 'totalPrice',
        render(totalPrice: number) {
          return (
            <span>
              $
              {totalPrice.toFixed(2)}
            </span>
          );
        }
      },
      {
        title: 'Quantity',
        dataIndex: 'quantity',
        render(quantity: number) {
          return <span>{quantity}</span>;
        }
      }
    ];
    const { earning, fetching } = this.state;
    return (
      <>
        <Head>
          <title>Earning details</title>
        </Head>
        <BreadcrumbComponent breadcrumbs={[{ title: 'Earning', href: '/earning' }, { title: 'Earning details' }]} />

        <Page>
          {!earning ? (
            <Loader />
          ) : (
            <Card>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <strong>Model name:</strong>
                </Col>
                <Col span={16}>
                  {earning.performerInfo && `${earning.performerInfo.firstName} ${earning.performerInfo.lastName}`}
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <strong>Model email:</strong>
                </Col>
                <Col span={16}>{earning.performerInfo && earning.performerInfo.email}</Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <strong>User name:</strong>
                </Col>
                <Col span={16}>{earning.userInfo && `${earning.userInfo.firstName} ${earning.userInfo.lastName}`}</Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <strong>User email:</strong>
                </Col>
                <Col span={16}>{earning.userInfo && earning.userInfo.email}</Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <strong>Gross price:</strong>
                </Col>
                <Col span={16}>
                  $
                  {earning.grossPrice.toFixed(2)}
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <strong>Net price:</strong>
                </Col>
                <Col span={16}>
                  $
                  {earning.netPrice.toFixed(2)}
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <strong>Commission:</strong>
                </Col>
                <Col span={16}>
                  {`${earning.commission * 100}%`}
                  / $
                  {earning.commission && (earning.commission * earning.grossPrice).toFixed(2)}
                </Col>
              </Row>
              {/* <Row gutter={[16, 16]}>
                <Col span={8}>
                  <strong>Paid status:</strong>
                </Col>
                <Col span={16}>{earning.isPaid ? <Tag color="green">Paid</Tag> : <Tag color="red">Unpaid</Tag>}</Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <strong>Paid at:</strong>
                </Col>
                <Col span={16}>{formatDate(earning.paidAt)}</Col>
              </Row> */}
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <strong>Type:</strong>
                </Col>
                <Col span={16}>
                  <Tag color="blue">{earning.sourceType}</Tag>
                </Col>
              </Row>
              {earning?.order && (
                <Row gutter={[16, 16]}>
                  <Table
                    dataSource={[earning?.order]}
                    columns={columnsProduct}
                    loading={fetching}
                    title={() => <strong>Product</strong>}
                    bordered
                    pagination={false}
                  />
                </Row>
              )}
            </Card>
          )}
        </Page>
      </>
    );
  }
}

export default EarningUpdate;
