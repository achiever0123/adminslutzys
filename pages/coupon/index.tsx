/* eslint-disable no-nested-ternary */
import Head from 'next/head';
import { PureComponent } from 'react';
import { message } from 'antd';
import Page from '@components/common/layout/page';
import { couponService } from '@services/coupon.service';
import { SearchFilter } from '@components/common/search-filter';
import { TableListCoupon } from '@components/coupon/table-list';
import { BreadcrumbComponent } from '@components/common';

interface IProps {
  performerId: string;
}

class Coupons extends PureComponent<IProps> {
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
    sort: 'desc'
  };

  async componentDidMount() {
    const { performerId } = this.props;
    const { filter } = this.state;
    if (performerId) {
      await this.setState({
        filter: {
          ...filter,
          ...{ performerId }
        }
      });
    }
    this.search();
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
  }

  async search(page = 1) {
    const {
      filter, limit, sort, sortBy, pagination
    } = this.state;
    try {
      await this.setState({ searching: true });
      const resp = await couponService.search({
        ...filter,
        limit,
        offset: (page - 1) * limit,
        sort,
        sortBy
      });
      this.setState({
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
      this.setState({ searching: false });
    }
  }

  async deleteCoupon(id: string) {
    const {
      pagination
    } = this.state;
    if (!window.confirm('Are you sure you want to delete this coupon?')) {
      return;
    }
    try {
      await couponService.delete(id);
      message.success('Deleted successfully');
      await this.search(pagination.current);
    } catch (e) {
      const err = (await Promise.resolve(e)) || {};
      message.error(err.message || 'An error occurred, please try again!');
    }
  }

  render() {
    const { list, searching, pagination } = this.state;
    const statuses = [
      {
        key: '',
        text: 'All status'
      },
      {
        key: 'active',
        text: 'Active'
      },
      {
        key: 'inactive',
        text: 'Inactive'
      }
    ];

    return (
      <>
        <Head>
          <title>Coupons</title>
        </Head>
        <BreadcrumbComponent breadcrumbs={[{ title: 'Coupons' }]} />
        <Page>
          <SearchFilter statuses={statuses} onSubmit={this.handleFilter.bind(this)} />
          <div style={{ marginBottom: '20px' }} />
          <TableListCoupon
            dataSource={list}
            rowKey="_id"
            loading={searching}
            pagination={{ ...pagination, showSizeChanger: false }}
            onChange={this.handleTableChange.bind(this)}
            deleteCoupon={this.deleteCoupon.bind(this)}
          />
        </Page>
      </>
    );
  }
}

export default Coupons;
