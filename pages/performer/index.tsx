/* eslint-disable no-nested-ternary */
import Head from 'next/head';
import Link from 'next/link';
import { PureComponent } from 'react';
import {
  Table, message, Tag, Avatar
} from 'antd';
import Page from '@components/common/layout/page';
import { performerService } from '@services/performer.service';
import { SearchFilter } from '@components/performer/search-filter';
import {
  EditOutlined, CameraOutlined, FileImageOutlined, VideoCameraOutlined, SkinOutlined
} from '@ant-design/icons';
import { formatDate } from '@lib/date';
import { BreadcrumbComponent, DropdownAction } from '@components/common';

interface IProps {
  status: string;
}
class Performers extends PureComponent<IProps> {
  static async getInitialProps({ ctx }) {
    return ctx.query;
  }

  state = {
    pagination: {} as any,
    searching: false,
    list: [],
    limit: 10,
    filter: {} as any,
    sortBy: 'updatedAt',
    sort: 'desc'
  };

  async componentDidMount() {
    const { status } = this.props;
    if (status) {
      await this.setState({ filter: { status } });
    }
    this.search();
  }

  async handleTableChange(pagination, filters, sorter) {
    const pager = { ...pagination };
    pager.current = pagination.current;
    await this.setState({
      pagination: pager,
      sortBy: sorter.field || 'updatedAt',
      sort: sorter.order ? (sorter.order === 'descend' ? 'desc' : 'asc') : 'desc'
    });
    this.search(pager.current);
  }

  async handleFilter(values) {
    const { filter } = this.state;
    await this.setState({ filter: { ...filter, ...values } });
    this.search();
  }

  async search(page = 1) {
    const {
      limit, sort, filter, sortBy, pagination
    } = this.state;
    try {
      await this.setState({ searching: true });

      const resp = await performerService.search({
        limit,
        offset: (page - 1) * limit,
        ...filter,
        sort,
        sortBy
      });
      this.setState({
        searching: false,
        list: resp.data.data,
        pagination: {
          ...pagination,
          total: resp.data.total
        }
      });
    } catch (e) {
      message.error('An error occurred, please try again!');
      this.setState({ searching: false });
    }
  }

  render() {
    const { list, searching, pagination } = this.state;
    const columns = [
      {
        title: '#',
        dataIndex: 'avatar',
        render(avatar) {
          return <Avatar src={avatar || '/no-avatar.png'} />;
        }
      },
      {
        title: 'Display name',
        dataIndex: 'name'
      },
      {
        title: 'Username',
        dataIndex: 'username'
      },
      {
        title: 'Email address',
        dataIndex: 'email'
      },
      {
        title: 'Status',
        dataIndex: 'status',
        render(status) {
          switch (status) {
            case 'active':
              return <Tag color="green">Active</Tag>;
            case 'inactive':
              return <Tag color="red">Inactive</Tag>;
            case 'pending-email-confirmation':
              return <Tag color="default">Pending</Tag>;
            default: return <Tag color="default">{status}</Tag>;
          }
        }
      },
      {
        title: 'Verified Email?',
        dataIndex: 'verifiedEmail',
        render(status) {
          switch (status) {
            case true:
              return <Tag color="green">Y</Tag>;
            case false:
              return <Tag color="red">N</Tag>;
            default: return <Tag color="default">{status}</Tag>;
          }
        }
      },
      {
        title: 'Verified ID?',
        dataIndex: 'verifiedDocument',
        render(status) {
          switch (status) {
            case true:
              return <Tag color="green">Y</Tag>;
            case false:
              return <Tag color="red">N</Tag>;
            default: return <Tag color="default">{status}</Tag>;
          }
        }
      },
      {
        title: 'Updated on',
        dataIndex: 'updatedAt',
        sorter: true,
        render(date: Date) {
          return <span>{formatDate(date)}</span>;
        }
      },
      {
        title: '#',
        dataIndex: '_id',
        render(id: string) {
          return (
            <DropdownAction
              menuOptions={[
                {
                  key: 'update',
                  name: 'Update',
                  children: (
                    <Link
                      href={{
                        pathname: '/performer/update',
                        query: { id }
                      }}
                    >
                      <a>
                        <EditOutlined />
                        {' '}
                        Update
                      </a>
                    </Link>
                  )
                },
                {
                  key: 'photo',
                  name: 'Photos',
                  children: (
                    <Link
                      href={{
                        pathname: '/photos',
                        query: { performerId: id, breadcrumb: 'performer' }
                      }}
                    >
                      <a>
                        <CameraOutlined />
                        {' '}
                        Photos
                      </a>
                    </Link>
                  )
                },
                {
                  key: 'gallery',
                  name: 'Galleries',
                  children: (
                    <Link
                      href={{
                        pathname: '/gallery',
                        query: { performerId: id, breadcrumb: 'performer' }
                      }}
                    >
                      <a>
                        <FileImageOutlined />
                        {' '}
                        Galleries
                      </a>
                    </Link>
                  )
                },
                {
                  key: 'video',
                  name: 'Videos',
                  children: (
                    <Link
                      href={{
                        pathname: '/video',
                        query: { performerId: id, breadcrumb: 'performer' }
                      }}
                    >
                      <a>
                        <VideoCameraOutlined />
                        {' '}
                        Videos
                      </a>
                    </Link>
                  )
                },
                {
                  key: 'product',
                  name: 'Products',
                  children: (
                    <Link
                      href={{
                        pathname: '/product',
                        query: { performerId: id, breadcrumb: 'performer' }
                      }}
                    >
                      <a>
                        <SkinOutlined />
                        {' '}
                        Products
                      </a>
                    </Link>
                  )
                }
              ]}
            />
          );
        }
      }
    ];
    return (
      <>
        <Head>
          <title>Models</title>
        </Head>
        <BreadcrumbComponent breadcrumbs={[{ title: 'Models' }]} />
        <Page>
          <SearchFilter onSubmit={this.handleFilter.bind(this)} />
          <div style={{ marginBottom: '10px' }} />
          <Table
            dataSource={list}
            columns={columns}
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
export default Performers;
