import Head from 'next/head';
import { PureComponent } from 'react';
import { message } from 'antd';
import Page from '@components/common/layout/page';
import { productService } from '@services/product.service';
import { SearchFilter } from '@components/common/search-filter';
import { TableListProduct } from '@components/product/table-list-product';
import { BreadcrumbComponent } from '@components/common';

interface IProps {
  breadcrumb: string;
  performerId: string;
 }

class Products extends PureComponent<IProps> {
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
      // eslint-disable-next-line no-nested-ternary
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
      const {
        filter, limit, sort, sortBy, pagination
      } = this.state;
      await this.setState({ searching: true });
      const resp = await productService.search({
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

  async deleteProduct(id: string) {
    const { pagination } = this.state;
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }
    try {
      await productService.delete(id);
      message.success('Deleted successfully');
      await this.search(pagination.current);
    } catch (e) {
      const err = (await Promise.resolve(e)) || {};
      message.error(err.message || 'An error occurred, please try again!');
    }
  }

  render() {
    const { breadcrumb, performerId } = this.props;
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
    // const types = [
    //   {
    //     key: '',
    //     text: 'All type'
    //   },
    //   {
    //     key: 'physical',
    //     text: 'Physical'
    //   },
    //   {
    //     key: 'digital',
    //     text: 'Digital'
    //   }
    // ];

    return (
      <>
        <Head>
          <title>Products</title>
        </Head>
        <BreadcrumbComponent breadcrumbs={breadcrumb === 'performer' ? [{ title: 'Performers', href: breadcrumb }, { title: 'Products' }] : [{ title: 'Products' }]} />
        <Page>
          <SearchFilter
            keyword
            searchWithPerformer
            performerId={performerId || ''}
            searchWithCategory
            // types={types}
            statuses={statuses}
            onSubmit={this.handleFilter.bind(this)}
          />
          <div style={{ marginBottom: '20px' }} />
          <TableListProduct
            dataSource={list}
            rowKey="_id"
            loading={searching}
            pagination={{ ...pagination, showSizeChanger: false }}
            onChange={this.handleTableChange.bind(this)}
            deleteProduct={this.deleteProduct.bind(this)}
          />
        </Page>
      </>
    );
  }
}

export default Products;
