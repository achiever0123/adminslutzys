import Head from 'next/head';
import { PureComponent } from 'react';
import { message } from 'antd';
import Page from '@components/common/layout/page';
import { SearchFilter } from '@components/common/search-filter';
import { TableListCategory } from '@components/category/table-list';
import { BreadcrumbComponent } from '@components/common';
import { categoryService } from '@services/category.service';

interface IProps {
}

class categorys extends PureComponent<IProps> {
  static async getInitialProps({ ctx }) {
    return ctx.query;
  }

  state = {
    fetching: false,
    limit: 10,
    offset: 0,
    list: [] as any,
    totalList: 0,
    filter: {} as any,
    sortBy: 'updatedAt'
  };

  async componentDidMount() {
    this.search();
  }

  async handleTabChange(data) {
    await this.setState({ offset: data.current - 1 });
    this.search();
  }

  async handleFilter(values) {
    const { filter } = this.state;
    await this.setState({ filter: { ...filter, ...values } });
    this.search();
  }

  async search() {
    const {
      filter, limit, offset, sortBy
    } = this.state;
    try {
      await this.setState({ fetching: true });
      const resp = await categoryService.search({
        ...filter,
        limit,
        offset: offset * limit,
        sortBy
      });
      await this.setState({
        list: resp.data.data,
        totalList: resp.data.total,
        fetching: false
      });
    } catch (e) {
      message.error('An error occurred, please try again!');
      this.setState({ fetching: false });
    }
  }

  async deleteCategory(id: string) {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }
    try {
      await categoryService.delete(id);
      message.success('Deleted successfully');
      await this.search();
    } catch (error) {
      message.error(error.message || 'An error occurred, please try again!');
    }
  }

  render() {
    const { list, totalList, fetching } = this.state;
    const statuses = [
      {
        key: '',
        text: 'All status'
      },
      {
        key: 'inactive',
        text: 'Inactive'
      },
      {
        key: 'active',
        text: 'Active'
      }
    ];

    return (
      <>
        <Head>
          <title>Categories</title>
        </Head>
        <BreadcrumbComponent breadcrumbs={[{ title: 'Categories' }]} />
        <Page>
          <SearchFilter
            statuses={statuses}
            onSubmit={this.handleFilter.bind(this)}
          />
          <div style={{ marginBottom: '20px' }} />
          <TableListCategory
            dataSource={list}
            pagination={{ total: totalList }}
            rowKey="_id"
            loading={fetching}
            onChange={this.handleTabChange.bind(this)}
            deleteCategory={this.deleteCategory.bind(this)}
          />
        </Page>
      </>
    );
  }
}

export default categorys;
