/* eslint-disable no-nested-ternary */
import Head from 'next/head';
import { PureComponent } from 'react';
import { message } from 'antd';
import Page from '@components/common/layout/page';
import { photoService } from '@services/photo.service';
import { SearchFilter } from '@components/common/search-filter';
import { TableListPhoto } from '@components/photo/table-list';
import { BreadcrumbComponent } from '@components/common';

interface IProps {
  performerId?: string;
  galleryId?: string;
  breadcrumb?: string;
}

class Photos extends PureComponent<IProps> {
  static async getInitialProps({ ctx }) {
    const { performerId, galleryId, breadcrumb } = ctx.query;
    console.log(123, performerId, breadcrumb);
    return {
      performerId, galleryId, breadcrumb
    };
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
    const { performerId, galleryId } = this.props;
    console.log(this.props);
    const {
      filter
    } = this.state;

    if (performerId || galleryId) {
      await this.setState({
        filter: {
          ...filter,
          ...{
            performerId: performerId || '',
            galleryId: galleryId || ''
          }
        }
      });
    }
    this.search();
  }

  handleTableChange = async (pagination, filters, sorter) => {
    const pager = { ...pagination };
    pager.current = pagination.current;
    await this.setState({
      limit: pagination.pageSize,
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
    try {
      await this.setState({ searching: true });
      const {
        filter, limit, sort, pagination,
        sortBy
      } = this.state;
      const resp = await photoService.search({
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
          pageSize: limit,
          showSizeChanger: true
        }
      });
    } catch (e) {
      message.error('An error occurred, please try again!');
      this.setState({ searching: false });
    }
  }

  async deletePhoto(id: string) {
    const { pagination } = this.state;
    if (!window.confirm('Are you sure you want to delete this photo?')) {
      return;
    }
    try {
      await photoService.delete(id);
      message.success('Deleted successfully');
      await this.search(pagination.current);
    } catch (e) {
      const err = (await Promise.resolve(e)) || {};
      message.error(err.message || 'An error occurred, please try again!');
    }
  }

  render() {
    const { performerId, galleryId, breadcrumb } = this.props;
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
          <title>Photos</title>
        </Head>
        <BreadcrumbComponent breadcrumbs={breadcrumb === 'performer' ? [{ title: 'Performers', href: breadcrumb }, { title: 'Photos' }] : [{ title: 'Photos' }]} />
        <Page>
          <SearchFilter
            keyword
            searchWithPerformer
            statuses={statuses}
            onSubmit={this.handleFilter.bind(this)}
            performerId={performerId || ''}
            searchWithGallery
            galleryId={galleryId || ''}
          />
          <div style={{ marginBottom: '20px' }} />
          <TableListPhoto
            dataSource={list}
            rowKey="_id"
            loading={searching}
            pagination={{ ...pagination, showSizeChanger: false }}
            onChange={this.handleTableChange.bind(this)}
            deletePhoto={this.deletePhoto.bind(this)}
          />
        </Page>
      </>
    );
  }
}

export default Photos;
