/* eslint-disable jsx-a11y/label-has-associated-control */
import {
  Layout, message, Select, Button,
  Input, Space, Statistic, Divider, Spin
} from 'antd';
import Head from 'next/head';
import { PureComponent } from 'react';
import { ICountry, PayoutRequestInterface } from 'src/interfaces';
import { BreadcrumbComponent } from '@components/common/breadcrumb';
import Page from '@components/common/layout/page';
import { payoutRequestService, utilsService } from 'src/services';
import Router from 'next/router';
import { getResponseError } from '@lib/utils';
import { formatDate } from 'src/lib/date';

const { Content } = Layout;

interface IProps {
  id: string;
  performerId: string;
  countries: ICountry[];
}

interface IStates {
  request: PayoutRequestInterface;
  loading: boolean;
  submiting: boolean;
  status: string;
  adminNote: any;
  statsPayout: {
    totalPrice: number;
    paidPrice: number;
    unpaidPrice: number;
  }
}

class PayoutDetailPage extends PureComponent<IProps, IStates> {
  static async getInitialProps({ ctx }) {
    const [countries] = await Promise.all([
      utilsService.countriesList()
    ]);
    return { ...ctx.query, countries: countries?.data || [] };
  }

  constructor(props: IProps) {
    super(props);
    this.state = {
      request: null,
      loading: true,
      submiting: false,
      status: '',
      adminNote: '',
      statsPayout: {
        totalPrice: 0,
        paidPrice: 0,
        unpaidPrice: 0
      }
    };
  }

  componentDidMount() {
    this.getData();
    this.getStatsPayout();
  }

  async onUpdate() {
    const { status, adminNote, request } = this.state;
    try {
      await this.setState({ submiting: true });
      await payoutRequestService.update(request._id, {
        status,
        adminNote
      });
      message.success('Updated successfully');
      Router.replace('/payout-request');
    } catch (e) {
      const err = await Promise.resolve(e);
      message.error(getResponseError(err), 10);
      this.setState({ submiting: false });
    }
  }

  async getData() {
    const { id } = this.props;
    try {
      await this.setState({ loading: true });
      const resp = await payoutRequestService.detail(id);
      await this.setState({
        request: resp.data,
        status: resp.data.status,
        adminNote: resp.data.adminNote
      });
    } catch (e) {
      const err = await Promise.resolve(e);
      message.error(getResponseError(err));
    } finally {
      this.setState({ loading: false });
    }
  }

  async getStatsPayout() {
    const { performerId } = this.props;
    try {
      const resp = await payoutRequestService.stats({
        sourceId: performerId
      });
      this.setState({
        statsPayout: resp.data
      });
    } catch (e) {
      const err = await Promise.resolve(e);
      message.error(getResponseError(err));
    } finally {
      this.setState({ loading: false });
    }
  }

  render() {
    const { countries = [] } = this.props;
    const {
      request, adminNote, loading, submiting, statsPayout, status
    } = this.state;
    const country = countries && countries.find((c) => c.code === request?.paymentAccountInfo?.country);
    return (
      <Layout>
        <Head>
          <title>Request Details</title>
        </Head>
        <Content>
          <div className="main-container">
            <BreadcrumbComponent
              breadcrumbs={[
                { title: 'Payout Requests', href: '/payout-request' },
                {
                  title: 'Request Details'
                }
              ]}
            />
            {loading && <div className="text-center"><Spin /></div>}
            {request && (
              <Page>
                <div style={{ margin: '20px 0', textAlign: 'center', width: '100%' }}>
                  <Space size="large">
                    <Statistic
                      prefix="$"
                      title="Total Earned"
                      value={statsPayout?.totalPrice || 0}
                      precision={2}
                    />
                    <Statistic
                      prefix="$"
                      title="Total Paid"
                      value={statsPayout?.paidPrice || 0}
                      precision={2}
                    />
                    <Statistic
                      prefix="$"
                      title="Total Unpaid"
                      value={statsPayout?.unpaidPrice || 0}
                      precision={2}
                    />
                  </Space>
                </div>
                <p>
                  Model:
                  {' '}
                  <strong>{request?.sourceInfo?.name || request?.sourceInfo?.username || 'N/A'}</strong>
                </p>
                <p>
                  Requested from
                  {' '}
                  {formatDate(request?.fromDate, 'LL')}
                  {' '}
                  to
                  {' '}
                  {formatDate(request?.toDate, 'LL')}
                </p>
                <p>
                  Requested price:
                  {' '}
                  $
                  {(request.requestedPrice || 0).toFixed(2)}
                </p>
                <p>
                  Requested at:
                  {' '}
                  {formatDate(request.createdAt)}
                </p>
                <p>
                  User Note:
                  {' '}
                  {request.requestNote}
                </p>
                <Divider>
                  Payment method
                  {' '}
                  {request.paymentAccountType === 'paypal' ? <img src="/paypal-ico.png" height="30px" alt="paypal" /> : <img src="/banking-ico.png" height="30px" alt="banking" />}
                </Divider>
                {request.paymentAccountType === 'paypal' ? (
                  <div>
                    Email:
                    {' '}
                    {request?.paymentAccountInfo?.email || 'N/A'}
                  </div>
                ) : (
                  <div>
                    <p>
                      Bank name:
                      {' '}
                      {request?.paymentAccountInfo?.bankName || 'N/A'}
                    </p>
                    <p>
                      Bank account number:
                      {' '}
                      {request?.paymentAccountInfo?.bankAccount || 'N/A'}
                    </p>
                    <p>
                      Bank account:
                      {' '}
                      {`${request?.paymentAccountInfo?.firstName} ${request?.paymentAccountInfo?.lastName}`}
                    </p>
                    <p>
                      Bank routing:
                      {' '}
                      {request?.paymentAccountInfo?.bankRouting || 'N/A'}
                    </p>
                    <p>
                      Bank swift code:
                      {' '}
                      {request?.paymentAccountInfo?.bankSwiftCode || 'N/A'}
                    </p>
                    <p>
                      Country:
                      {' '}
                      {request?.paymentAccountInfo?.country ? (
                        <span>
                          <img src={country?.flag} alt="flag" width="20px" />
                          {' '}
                          {country?.name}
                        </span>
                      ) : 'N/A' }
                    </p>
                  </div>
                )}
                <Divider />
                <div style={{ marginBottom: '10px' }}>
                  <p>
                    Update status here
                  </p>
                  <Select
                    disabled={submiting || ['done', 'rejected'].includes(request?.status)}
                    style={{ width: '100%' }}
                    onChange={(e) => this.setState({ status: e })}
                    value={status}
                  >
                    <Select.Option key="pending" value="pending">
                      Pending
                    </Select.Option>
                    <Select.Option key="rejected" value="rejected">
                      Rejected
                    </Select.Option>
                    <Select.Option key="done" value="done">
                      Done
                    </Select.Option>
                  </Select>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <p>Note to user: </p>
                  <Input.TextArea
                    defaultValue={adminNote}
                    style={{ width: '100%' }}
                    onChange={(v) => {
                      this.setState({ adminNote: v.target.value });
                    }}
                    placeholder="Text something to user"
                    autoSize={{ minRows: 3 }}
                  />
                </div>
                <div style={{ marginBottom: '10px', display: 'flex' }}>
                  <Button
                    type="primary"
                    onClick={this.onUpdate.bind(this)}
                  >
                    Update
                  </Button>
                  &nbsp;
                  <Button
                    type="default"
                    onClick={() => Router.back()}
                  >
                    Back
                  </Button>
                </div>
              </Page>
            )}
          </div>
        </Content>
      </Layout>
    );
  }
}

export default PayoutDetailPage;
