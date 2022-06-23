import Head from 'next/head';
import {
  Row, Col, Statistic, Card, message
} from 'antd';
import { PureComponent } from 'react';
import { utilsService } from '@services/utils.service';
import {
  AreaChartOutlined, PieChartOutlined, BarChartOutlined,
  DotChartOutlined, LineChartOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import { getResponseError } from '@lib/utils';

export default class Dashboard extends PureComponent<any> {
  state = {
    stats: {
      totalActivePerformers: 0,
      totalActiveSubscribers: 0,
      totalActiveUsers: 0,
      totalDeliveredOrders: 0,
      totalGalleries: 0,
      totalGrossPrice: 0,
      totalInactivePerformers: 0,
      totalInactiveUsers: 0,
      totalNetPrice: 0,
      totalOrders: 5,
      totalPendingPerformers: 0,
      totalPendingUsers: 0,
      totalPhotos: 0,
      totalRefundedOrders: 0,
      totalCreatedOrders: 0,
      totalShippingdOrders: 0,
      totalSubscribers: 0,
      totalVideos: 0,
      totalProducts: 0
    }
  }

  async componentDidMount() {
    try {
      const stats = await (await utilsService.statistics()).data;
      if (stats) {
        this.setState({ stats });
      }
    } catch (e) {
      const err = await Promise.resolve(e);
      message.error(getResponseError(err));
    }
  }

  render() {
    const { stats } = this.state;
    return (
      <>
        <Head>
          <title>Dashboard</title>
        </Head>
        <Row gutter={24} className="dashboard-stats">
          <Col span={8}>
            <Link href="/users?status=active">
              <a>
                <Card>
                  <Statistic
                    title="ACTIVE USERS"
                    value={stats.totalActiveUsers}
                    valueStyle={{ color: '#ffc107' }}
                    prefix={<LineChartOutlined />}
                  />
                </Card>
              </a>
            </Link>
          </Col>
          <Col span={8}>
            <Link href="/users?status=inactive">
              <a>
                <Card>
                  <Statistic
                    title="INACTIVE USERS"
                    value={stats.totalInactiveUsers}
                    valueStyle={{ color: '#ffc107' }}
                    prefix={<LineChartOutlined />}
                  />
                </Card>
              </a>
            </Link>
          </Col>
          <Col span={8}>
            <Link href="/users?status=pending-email-confirmation">
              <a>
                <Card>
                  <Statistic
                    title="NOT VERIFIED EMAIL USERS"
                    value={stats.totalPendingUsers}
                    valueStyle={{ color: '#ffc107' }}
                    prefix={<LineChartOutlined />}
                  />
                </Card>
              </a>
            </Link>
          </Col>
          <Col span={8}>
            <Link href="/performer?status=active">
              <a>
                <Card>
                  <Statistic
                    title="ACTIVE MODELS"
                    value={stats.totalActivePerformers}
                    valueStyle={{ color: '#009688' }}
                    prefix={<BarChartOutlined />}
                  />
                </Card>
              </a>
            </Link>

          </Col>
          <Col span={8}>
            <Link href="/performer?status=inactive">
              <a>
                <Card>
                  <Statistic
                    title="INACTIVE MODELS"
                    value={stats.totalInactivePerformers}
                    valueStyle={{ color: '#009688' }}
                    prefix={<BarChartOutlined />}
                  />
                </Card>
              </a>
            </Link>
          </Col>
          <Col span={8}>
            <Link href="/performer?status=pending-email-confirmation">
              <a>
                <Card>
                  <Statistic
                    title="NOT VERIFIED EMAIL MODELS"
                    value={stats.totalPendingPerformers}
                    valueStyle={{ color: '#009688' }}
                    prefix={<BarChartOutlined />}
                  />
                </Card>
              </a>
            </Link>
          </Col>
          <Col span={8}>
            <Link href="/subscription">
              <a>
                <Card>
                  <Statistic
                    title="SUBSCRIPTIONS"
                    value={stats.totalSubscribers}
                    valueStyle={{ color: '#5399d0' }}
                    prefix={<PieChartOutlined />}
                  />
                </Card>
              </a>
            </Link>
          </Col>
          <Col span={8}>
            <Link href="/gallery">
              <a>
                <Card>
                  <Statistic
                    title="GALLERIES"
                    value={stats.totalGalleries}
                    valueStyle={{ color: '#5399d0' }}
                    prefix={<PieChartOutlined />}
                  />
                </Card>
              </a>
            </Link>
          </Col>
          <Col span={8}>
            <Link href="/photos">
              <a>
                <Card>
                  <Statistic
                    title="PHOTOS"
                    value={stats.totalPhotos}
                    valueStyle={{ color: '#5399d0' }}
                    prefix={<PieChartOutlined />}
                  />
                </Card>
              </a>
            </Link>
          </Col>
          <Col span={8}>
            <Link href="/product">
              <a>
                <Card>
                  <Statistic
                    title="PRODUCTS"
                    value={stats.totalProducts}
                    valueStyle={{ color: '#5399d0' }}
                    prefix={<PieChartOutlined />}
                  />
                </Card>
              </a>
            </Link>
          </Col>
          <Col span={8}>
            <Link href="/video">
              <a>
                <Card>
                  <Statistic
                    title="VIDEOS"
                    value={stats.totalVideos}
                    valueStyle={{ color: '#5399d0' }}
                    prefix={<DotChartOutlined />}
                  />
                </Card>
              </a>
            </Link>
          </Col>
          <Col span={8}>
            <Link href="/earning">
              <a>
                <Card>
                  <Statistic
                    title="GROSS PROFIT"
                    value={`$${stats?.totalGrossPrice.toFixed(2)}`}
                    valueStyle={{ color: '#fb2b2b' }}
                    prefix={<DotChartOutlined />}
                  />
                </Card>
              </a>
            </Link>
          </Col>
          <Col span={8}>
            <Link href="/earning">
              <a>
                <Card>
                  <Statistic
                    title="NET PROFIT"
                    value={`$${stats?.totalNetPrice.toFixed(2)}`}
                    valueStyle={{ color: '#fb2b2b' }}
                    prefix={<DotChartOutlined />}
                  />
                </Card>
              </a>
            </Link>
          </Col>
          <Col span={8}>
            <Link href="/earning">
              <a>
                <Card>
                  <Statistic
                    title="COMMISSION PROFIT"
                    value={`$${(stats?.totalGrossPrice - stats?.totalNetPrice || 0).toFixed(2)}`}
                    valueStyle={{ color: '#fb2b2b' }}
                    prefix={<DotChartOutlined />}
                  />
                </Card>
              </a>
            </Link>
          </Col>
          <Col span={8}>
            <Link href="/order?deliveryStatus=created">
              <a>
                <Card>
                  <Statistic
                    title="CREATED ORDERS"
                    value={stats.totalCreatedOrders}
                    valueStyle={{ color: '#c8d841' }}
                    prefix={<AreaChartOutlined />}
                  />
                </Card>
              </a>
            </Link>
          </Col>
          <Col span={8}>
            <Link href="/order?deliveryStatus=shipping">
              <a>
                <Card>
                  <Statistic
                    title="SHIPPING ORDERS"
                    value={stats.totalShippingdOrders}
                    valueStyle={{ color: '#c8d841' }}
                    prefix={<AreaChartOutlined />}
                  />
                </Card>
              </a>
            </Link>
          </Col>
          <Col span={8}>
            <Link href="/order?deliveryStatus=delivered">
              <a>
                <Card>
                  <Statistic
                    title="DELIVERED ORDERS"
                    value={stats.totalDeliveredOrders}
                    valueStyle={{ color: '#c8d841' }}
                    prefix={<AreaChartOutlined />}
                  />
                </Card>
              </a>
            </Link>
          </Col>
          <Col span={8}>
            <Link href="/order?deliveryStatus=refunded">
              <a>
                <Card>
                  <Statistic
                    title="REFUNDED ORDERS"
                    value={stats.totalRefundedOrders}
                    valueStyle={{ color: '#c8d841' }}
                    prefix={<AreaChartOutlined />}
                  />
                </Card>
              </a>
            </Link>
          </Col>
        </Row>
      </>
    );
  }
}
