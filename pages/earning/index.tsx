/* eslint-disable no-nested-ternary */
import Head from 'next/head';
import { PureComponent } from 'react';
import {
  message, Statistic, Row, Col
} from 'antd';
import Page from '@components/common/layout/page';
import { earningService } from '@services/earning.service';
import { SearchFilter } from '@components/common/search-filter';
import { TableListEarning } from '@components/earning/table-list-earning';
import { BreadcrumbComponent } from '@components/common';
import { pick } from 'lodash';

interface IEarningStatResponse {
  totalCommission: number;
  totalGrossPrice: number;
  totalNetPrice: number;
}

interface IProps {
  sourceId: string;
  stats: IEarningStatResponse;
}

class Earning extends PureComponent<IProps> {
  static async getInitialProps({ ctx }) {
    return ctx.query;
  }

  state = {
    pagination: {} as any,
    searching: false,
    list: [] as any,
    limit: 10,
    filter: {} as any,
    sortBy: 'updatedAt',
    sort: 'desc',
    stats: {} as IEarningStatResponse
  };

  async componentDidMount() {
    this.search();
    this.stats();
  }

  handleTableChange = async (pagi, filters, sorter) => {
    const { pagination } = this.state;
    const pager = { ...pagination };
    pager.current = pagi.current;
    await this.setState({
      pagination: pager,
      sortBy: sorter.field || 'createdAt',
      sort: sorter.order ? (sorter.order === 'descend' ? 'desc' : 'asc') : 'desc'
    });
    this.search(pager.current);
  };

  async handleFilter(values) {
    const { filter } = this.state;
    await this.setState({ filter: { ...filter, ...values } });
    this.search();
    this.stats();
  }

  async search(page = 1) {
    const {
      filter, limit, sort, sortBy, pagination
    } = this.state;
    try {
      await this.setState({ searching: true });
      const resp = await earningService.search({
        ...filter,
        limit,
        offset: (page - 1) * limit,
        sort,
        sortBy,
        isToken: false
      });
      await this.setState({
        searching: false,
        list: resp.data.data,
        pagination: {
          ...pagination,
          total: resp.data.total,
          pageSize: limit
        }
      });
    } catch (e) {
      message.error('An error occurred, please try again!');
      await this.setState({ searching: false });
    }
  }

  async stats() {
    const { filter } = this.state;
    try {
      const resp = await earningService.stats({
        ...filter
      });
      await this.setState({
        stats: resp.data
      });
    } catch (e) {
      message.error('An error occurred, please try again!');
    }
  }

  async updatePaidStatus() {
    try {
      const { filter } = this.state;
      if (!filter.performerId) {
        message.error('Please filter by a performer');
        return;
      }
      if (!filter.fromDate || !filter.toDate) {
        message.error('Please filter by date range');
        return;
      }
      await earningService.updatePaidStatus(pick(filter, ['performerId', 'fromDate', 'toDate']));
      message.success('Updated successfully');
      this.search();
      this.stats();
    } catch (error) {
      message.error('An error occurred, please try again!');
    }
  }

  render() {
    const {
      list, searching, pagination, stats
    } = this.state;
    const sourceType = [
      {
        key: '',
        text: 'All type'
      },
      {
        key: 'video',
        text: 'Video'
      },
      {
        key: 'product',
        text: 'Store'
      },
      {
        key: 'performer',
        text: 'Subscription'
      }
    ];

    return (
      <>
        <Head>
          <title>Earnings</title>
        </Head>
        <BreadcrumbComponent breadcrumbs={[{ title: 'Earnings' }]} />
        <Page>
          <Row gutter={16} style={{ marginBottom: '10px' }}>
            <Col span={8}>
              <Statistic title="Total Gross Price" prefix="$" value={stats.totalGrossPrice} precision={2} />
            </Col>
            <Col span={8}>
              <Statistic title="Admin earned" prefix="$" value={stats.totalCommission} precision={2} />
            </Col>
            <Col span={8}>
              <Statistic title="Performer earned" prefix="$" value={stats.totalNetPrice} precision={2} />
            </Col>
          </Row>
          <SearchFilter
            sourceType={sourceType}
            onSubmit={this.handleFilter.bind(this)}
            searchWithPerformer
            dateRange
          />
          <div style={{ marginBottom: '20px' }} />
          <TableListEarning
            dataSource={list}
            rowKey="_id"
            loading={searching}
            pagination={{ ...pagination, showSizeChanger: false }}
            onChange={this.handleTableChange.bind(this)}
          />
        </Page>
      </>
    );
  }
}

export default Earning;
