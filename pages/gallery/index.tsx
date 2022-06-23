/* eslint-disable no-nested-ternary */
import Head from 'next/head';
import { PureComponent } from 'react';
import { message } from 'antd';
import Page from '@components/common/layout/page';
import { galleryService } from '@services/gallery.service';
import { SearchFilter } from '@components/common/search-filter';
import { TableListGallery } from '@components/gallery/table-list';
import { BreadcrumbComponent } from '@components/common';

interface IProps {
  performerId: string;
  breadcrumb: string;
}

class Galleries extends PureComponent<IProps> {
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
      filter, limit, sort, sortBy, pagination
    } = this.state;
    try {
      await this.setState({ searching: true });
      const resp = await galleryService.search({
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

  async deleteGallery(id: string) {
    const {
      pagination
    } = this.state;
    if (!window.confirm('Are you sure you want to delete this gallery?')) {
      return;
    }
    try {
      await galleryService.delete(id);
      message.success('Deleted successfully');
      await this.search(pagination.current);
    } catch (e) {
      const err = (await Promise.resolve(e)) || {};
      message.error(err.message || 'An error occurred, please try again!');
    }
  }

  render() {
    const {
      list, searching, pagination
    } = this.state;
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
      <>
        <Head>
          <title>Galleries</title>
        </Head>
        <BreadcrumbComponent breadcrumbs={breadcrumb === 'performer' ? [{ title: 'Performers', href: breadcrumb }, { title: 'Galleries' }] : [{ title: 'Galleries' }]} />
        <Page>
          <SearchFilter
            keyword
            searchWithPerformer
            statuses={statuses}
            onSubmit={this.handleFilter.bind(this)}
            performerId={performerId || ''}
          />
          <div style={{ marginBottom: '20px' }} />
          <TableListGallery
            dataSource={list}
            rowKey="_id"
            loading={searching}
            pagination={{ ...pagination, showSizeChanger: false }}
            onChange={this.handleTableChange.bind(this)}
            deleteGallery={this.deleteGallery.bind(this)}
          />
        </Page>
      </>
    );
  }
}

export default Galleries;
