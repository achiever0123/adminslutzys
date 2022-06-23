import { message } from 'antd';
import Head from 'next/head';
import { BreadcrumbComponent } from '@components/common/breadcrumb';
import Page from '@components/common/layout/page';
import { PureComponent } from 'react';
import { SearchFilter } from '@components/common/search-filter';
import { TableListSubscription } from '@components/subscription/table-list-subscription';
import { ISubscription } from 'src/interfaces';
import { subscriptionService } from '@services/subscription.service';
import { getResponseError } from '@lib/utils';

interface IProps {}
interface IStates {
  subscriptionList: ISubscription[];
  loading: boolean;
  pagination: {
    pageSize: number;
    current: number;
    total: number;
  };
  sort: string;
  sortBy: string;
  filter: {};
}

class SubscriptionPage extends PureComponent<IProps, IStates> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      subscriptionList: [],
      loading: false,
      pagination: {
        pageSize: 10,
        current: 1,
        total: 0
      },
      sort: 'desc',
      sortBy: 'updatedAt',
      filter: {}
    };
  }

  componentDidMount() {
    this.getData();
  }

  async handleFilter(values) {
    const { filter } = this.state;
    await this.setState({ filter: { ...filter, ...values } });
    this.getData();
  }

  async handleTabChange(data) {
    const { pagination } = this.state;
    await this.setState({ pagination: { ...pagination, current: data.current } });
    this.getData();
  }

  async onCancelSubscriber(subscription: ISubscription) {
    if (subscription.subscriptionType === 'system' && !window.confirm(`You are trying to cancel a subscription created by the site admin. Cancelling this will block access to ${subscription?.performerInfo?.name || subscription?.performerInfo?.username || 'the model'}'s content immediately. Do you wish to continue?`)) {
      return;
    }
    if (subscription.subscriptionType !== 'system' && !window.confirm(`Are you sure you want to cancel this subscription? Cancelling this will block access to ${subscription?.performerInfo?.name || subscription?.performerInfo?.username || 'the model'}'s content until the end of this cycle. Do you wish to continue?`)) {
      return;
    }
    try {
      await subscriptionService.cancelSubscription(subscription._id);
      this.getData();
      message.success('This subscription have been suspended');
    } catch (error) {
      const err = await Promise.resolve(error);
      message.error(getResponseError(err));
    }
  }

  async getData() {
    const {
      filter, sort, sortBy, pagination
    } = this.state;
    try {
      this.setState({ loading: true });
      const resp = await subscriptionService.search({
        ...filter,
        sort,
        sortBy,
        limit: pagination.pageSize,
        offset: (pagination.current - 1) * pagination.pageSize
      });
      this.setState({
        loading: false,
        subscriptionList: resp.data.data,
        pagination: { ...pagination, total: resp.data.total }
      });
    } catch (error) {
      message.error(getResponseError(await error) || 'An error occured. Please try again.');
      this.setState({ loading: false });
    }
  }

  render() {
    const { subscriptionList, pagination, loading } = this.state;
    return (
      <>
        <Head>
          <title>Subscription History</title>
        </Head>
        <BreadcrumbComponent breadcrumbs={[{ title: 'Subscription History' }]} />
        <Page>
          <SearchFilter searchWithPerformer onSubmit={this.handleFilter.bind(this)} />
          <div style={{ marginBottom: '20px' }} />
          <TableListSubscription
            dataSource={subscriptionList}
            pagination={{ ...pagination, showSizeChanger: false }}
            loading={loading}
            onChange={this.handleTabChange.bind(this)}
            rowKey="_id"
            onCancelSubscriber={this.onCancelSubscriber.bind(this)}
          />
        </Page>
      </>
    );
  }
}

export default SubscriptionPage;
