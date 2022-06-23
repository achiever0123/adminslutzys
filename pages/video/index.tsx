/* eslint-disable no-nested-ternary */
import Head from 'next/head';
import { PureComponent } from 'react';
import { message, Layout } from 'antd';
import Page from '@components/common/layout/page';
import { videoService } from '@services/video.service';
import { SearchFilter } from '@components/common/search-filter';
import { TableListVideo } from '@components/video/table-list';
import { BreadcrumbComponent } from '@components/common';

interface IProps {
  performerId: string;
  breadcrumb: string;
}

class Videos extends PureComponent<IProps> {
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

  handleTableChange = async (pagination, filters, sorter) => {
    const pager = { ...pagination };
    pager.current = pagination.current;
    await this.setState({
      pagination: pager,
      sortBy: sorter.field || 'updatedAt',
      sort: sorter.order
        ? sorter.order === 'descend'
          ? 'desc'
          : 'asc'
        : 'desc'
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
      filter, sort,
      sortBy, limit, pagination
    } = this.state;
    try {
      await this.setState({ searching: true });
      const resp = await videoService.search({
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

  async deleteVideo(id: string) {
    const { pagination } = this.state;
    if (!window.confirm('Are you sure you want to delete this content?')) {
      return;
    }
    try {
      await videoService.delete(id);
      message.success('Deleted successfully');
      await this.search(pagination.current);
    } catch (e) {
      const err = (await Promise.resolve(e)) || {};
      message.error(err.message || 'An error occurred, please try again!');
    }
  }

  render() {
    const { list, searching, pagination } = this.state;
    const { performerId, breadcrumb } = this.props;
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
      <Layout>
        <Head>
          <title>Videos</title>
        </Head>
        <BreadcrumbComponent breadcrumbs={breadcrumb === 'performer' ? [{ title: 'Performers', href: breadcrumb }, { title: 'Videos' }] : [{ title: 'Videos' }]} />
        <Page>
          <SearchFilter
            keyword
            searchWithPerformer
            statuses={statuses}
            onSubmit={this.handleFilter.bind(this)}
            performerId={performerId || ''}
          />
          <div style={{ marginBottom: '20px' }} />
          <TableListVideo
            dataSource={list}
            rowKey="_id"
            loading={searching}
            pagination={{ ...pagination, showSizeChanger: false }}
            onChange={this.handleTableChange.bind(this)}
            deleteVideo={this.deleteVideo.bind(this)}
          />
        </Page>
      </Layout>
    );
  }
}

export default Videos;
