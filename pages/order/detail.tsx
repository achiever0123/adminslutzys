import {
  Layout, message, Input, Select, Button, Tag
} from 'antd';
import Head from 'next/head';
import { PureComponent } from 'react';
import { BreadcrumbComponent } from '@components/common/breadcrumb';
import Page from '@components/common/layout/page';
import { orderService } from 'src/services';
import Router from 'next/router';
import { getResponseError } from '@lib/utils';

const { Content } = Layout;

interface IProps {
  id: string;
}

interface IStates {
  order: any;
  shippingCode: string;
  deliveryStatus: string;
}

class OrderDetailPage extends PureComponent<IProps, IStates> {
  static authenticate = true;

  static onlyPerformer = true;

  static async getInitialProps({ ctx }) {
    return ctx.query;
  }

  constructor(props: IProps) {
    super(props);
    this.state = {
      order: null,
      shippingCode: '',
      deliveryStatus: ''
    };
  }

  componentDidMount() {
    this.getData();
  }

  async onUpdate() {
    const { deliveryStatus, shippingCode } = this.state;
    const { id } = this.props;
    if (!shippingCode) {
      message.error('Missing shipping code');
      return;
    }
    try {
      await orderService.update(id, { deliveryStatus, shippingCode });
      message.success('Changes saved.');
    } catch (e) {
      message.error(getResponseError(await e));
    }
    Router.push('/order');
  }

  async getData() {
    const { id } = this.props;
    try {
      const { data: order } = await orderService.findDetailsById(id);
      await this.setState({
        order,
        shippingCode: order.shippingCode,
        deliveryStatus: order.deliveryStatus
      });
    } catch (e) {
      message.error('Can not find order!');
    }
  }

  render() {
    const { order } = this.state;
    return (
      <Layout>
        <Head>
          <title>Order Details</title>
        </Head>
        <Content>
          <div className="main-container">
            <BreadcrumbComponent
              breadcrumbs={[
                { title: 'Orders', href: '/order' },
                {
                  title: order && order.orderNumber ? `#${order.orderNumber}` : 'Order Details'
                }
              ]}
            />
            <Page>
              {order && (
              <div className="main-container">
                <div style={{ marginBottom: '10px' }}>
                  <strong>Order number</strong>
                  : #
                  {order.orderNumber}
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <strong>Name</strong>
                  :
                  {' '}
                  {order.name}
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <strong>Description</strong>
                  :
                  {' '}
                  {order.description}
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <strong>Product type:</strong>
                  {' '}
                  <Tag color="orange">{order.productType}</Tag>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <strong>Buyer</strong>
                  :
                  {' '}
                  {`${order.buyer?.name || order.buyer?.username || `${order.buyer?.firstName} ${order.buyer?.lastName}` || 'N/A'}`}
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <strong>Seller</strong>
                  :
                  {' '}
                  {`${order.seller?.name || order.seller?.username || 'N/A'}`}
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <strong>Quantity</strong>
                  :
                  {' '}
                  {order.quantity}
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <strong>Total Price</strong>
                  : $
                  {order.totalPrice}
                </div>
                {['physical'].includes(order?.productType)
                  ? (
                    <>
                      <div style={{ marginBottom: '10px' }}>
                        <strong>Delivery Phone Number</strong>
                        :
                        {' '}
                        {order.phoneNumber || 'N/A'}
                      </div>
                      <div style={{ marginBottom: '10px' }}>
                        <strong>Delivery Address</strong>
                        :
                        {' '}
                        {order.deliveryAddress || 'N/A'}
                      </div>
                      <div style={{ marginBottom: '10px' }}>
                        <strong>Delivery Postal Code</strong>
                        :
                        {' '}
                        {order.postalCode || 'N/A'}
                      </div>
                      <div style={{ marginBottom: '10px' }}>
                        <strong>Shipping Code</strong>
                        :
                        {' '}
                        <Input placeholder="Enter shipping code here" defaultValue={order.shippingCode} onChange={(e) => this.setState({ shippingCode: e.target.value })} />
                      </div>
                      <div style={{ marginBottom: '10px' }}>
                        <strong>Delivery Status:</strong>
                        {' '}
                        <Select onChange={(e) => this.setState({ deliveryStatus: e })} defaultValue={order.deliveryStatus}>
                          <Select.Option key="processing" value="processing">
                            Processing
                          </Select.Option>
                          <Select.Option key="shipping" value="shipping">
                            Shipping
                          </Select.Option>
                          <Select.Option key="delivered" value="delivered">
                            Delivered
                          </Select.Option>
                          <Select.Option key="refunded" value="refunded">
                            Refunded
                          </Select.Option>
                        </Select>
                      </div>
                    </>
                  ) : (
                    <div style={{ marginBottom: '10px' }}>
                      <strong>Delivery Status:</strong>
                      {' '}
                      <Tag color="green">Delivered</Tag>
                    </div>
                  )}
                <div style={{ marginBottom: '10px' }}>
                  <Button danger onClick={this.onUpdate.bind(this)}>Update</Button>
                </div>
              </div>
              )}
            </Page>
          </div>
        </Content>
      </Layout>
    );
  }
}

export default OrderDetailPage;
