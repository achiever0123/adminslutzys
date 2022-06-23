import Head from 'next/head';
import { PureComponent, createRef } from 'react';
import { Layout, Tabs, message } from 'antd';
import Page from '@components/common/layout/page';
import { AccountForm } from '@components/performer/AccountForm';
import { PerformerDocument } from '@components/performer/Document';
import { SubscriptionForm } from '@components/performer/Subcription';
import { BankingForm } from '@components/performer/BankingForm';
import { CCbillSettingForm } from '@components/performer/ccbill-setting';
import { CommissionSettingForm } from '@components/performer/commission-setting';
import {
  ICountry,
  ILangguges,
  IPhoneCodes,
  IPerformer
} from 'src/interfaces';
import { authService, performerService } from '@services/index';
import Loader from '@components/common/base/loader';
import { utilsService } from '@services/utils.service';
import { UpdatePaswordForm } from '@components/user/update-password-form';
import { BreadcrumbComponent } from '@components/common';

interface IProps {
  id: string;
  countries: ICountry[];
  languages: ILangguges[];
  phoneCodes: IPhoneCodes[];
  heights: any;
  weights: any;
  bodyInfo: any;
}
class PerformerUpdate extends PureComponent<IProps> {
  static async getInitialProps({ ctx }) {
    const [countries, languages, phoneCodes, bodyInfo] = await Promise.all([
      utilsService.countriesList(),
      utilsService.languagesList(),
      utilsService.phoneCodesList(),
      utilsService.bodyInfo()
    ]);
    return {
      countries: countries && countries.data ? countries.data : [],
      languages: languages && languages.data ? languages.data : [],
      phoneCodes: phoneCodes && phoneCodes.data ? phoneCodes.data : [],
      bodyInfo: bodyInfo?.data,
      ...ctx.query
    };
  }

  formRef = createRef() as any;

  state = {
    pwUpdating: false,
    updating: false,
    fetching: false,
    performer: {} as IPerformer,
    settingUpdating: false,
    avatarUrl: '',
    coverUrl: ''
  };

  customFields = {};

  async componentDidMount() {
    const { id } = this.props;
    try {
      await this.setState({ fetching: true });
      const resp = await performerService.findById(id);
      this.setState({
        performer: resp?.data, avatarUrl: resp?.data?.avatar, coverUrl: resp?.data?.cover, fetching: false
      });
    } catch (e) {
      message.error('Error while fecting performer!');
      this.setState({ fetching: false });
    }
  }

  onUploaded(field: string, resp: any) {
    if (field === 'avatarId' && resp?.response?.data?.url) {
      this.setState({ avatarUrl: resp?.response?.data?.url });
    }
    if (field === 'coverId' && resp?.response?.data?.url) {
      this.setState({ coverUrl: resp?.response?.data?.url });
    }
    this.customFields[field] = resp.response.data._id;
  }

  async updatePassword(data: any) {
    const { id } = this.props;
    try {
      await this.setState({ pwUpdating: true });
      await authService.updatePassword(data.password, id, 'performer');
      message.success('Password has been updated!');
    } catch (e) {
      message.error('An error occurred, please try again!');
    } finally {
      this.setState({ pwUpdating: false });
    }
  }

  async updatePaymentGatewaySetting(data: any) {
    const { id } = this.props;
    try {
      await this.setState({ settingUpdating: true });
      await performerService.updatePaymentGatewaySetting(id, {
        performerId: id,
        key: 'ccbill',
        status: 'active',
        value: data
      });
      message.success('CCbill setting has been updated!');
    } catch (error) {
      message.error('An error occurred, please try again!');
    } finally {
      this.setState({ settingUpdating: false });
    }
  }

  async updateCommissionSetting(data: any) {
    const { id } = this.props;
    try {
      await this.setState({ settingUpdating: true });
      await performerService.updateCommissionSetting(id, { ...data, performerId: id });
      message.success('Commission settings has been updated!');
    } catch (error) {
      message.error('An error occurred, please try again!');
    } finally {
      this.setState({ settingUpdating: false });
    }
  }

  async updateBankingSetting(data: any) {
    const { id } = this.props;
    try {
      await this.setState({ settingUpdating: true });
      await performerService.updateBankingSetting(id, { ...data, performerId: id });
      message.success('Banking setting has been updated!');
    } catch (error) {
      message.error('An error occurred, please try again!');
    } finally {
      this.setState({ settingUpdating: false });
    }
  }

  async submit(data: any) {
    const { id } = this.props;
    const newData = data;
    try {
      if (data.status === 'pending-email-confirmation') {
        delete newData.status;
      }
      await this.setState({ updating: true });
      const updated = await performerService.update(id, {
        ...newData,
        ...this.customFields
      });
      this.setState({ performer: updated.data, updating: false });
      message.success('Updated successfully');
    } catch (e) {
      const error = await e;
      message.error(error && (error.message || 'An error occurred, please try again!'));
      this.setState({ updating: false });
    }
  }

  render() {
    const {
      pwUpdating, performer, updating, fetching, settingUpdating, coverUrl, avatarUrl
    } = this.state;
    const {
      countries, languages, phoneCodes, bodyInfo
    } = this.props;
    return (
      <Layout>
        <Head>
          <title>Performer update</title>
        </Head>
        <BreadcrumbComponent
          breadcrumbs={[
            { title: 'Performers', href: '/performer' },
            { title: performer.username },
            { title: 'Update' }
          ]}
        />
        <Page>
          {fetching ? (
            <Loader />
          ) : (
            <Tabs defaultActiveKey="basic" tabPosition="top">
              <Tabs.TabPane tab={<span>General info</span>} key="basic">
                <AccountForm
                  onUploaded={this.onUploaded.bind(this)}
                  onFinish={this.submit.bind(this)}
                  performer={performer}
                  submiting={updating}
                  countries={countries}
                  languages={languages}
                  avatarUrl={avatarUrl}
                  coverUrl={coverUrl}
                  phoneCodes={phoneCodes}
                  bodyInfo={bodyInfo}
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab={<span>ID Documents</span>} key="document">
                <PerformerDocument
                  submiting={updating}
                  onUploaded={this.onUploaded.bind(this)}
                  onFinish={this.submit.bind(this)}
                  performer={performer}
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab={<span>Subscription Settings</span>} key="subscription">
                <SubscriptionForm
                  submiting={updating}
                  onFinish={this.submit.bind(this)}
                  performer={performer}
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab={<span>Banking Settings</span>} key="banking">
                <BankingForm
                  submiting={settingUpdating}
                  onFinish={this.updateBankingSetting.bind(this)}
                  bankingInformation={performer.bankingInformation || null}
                  countries={countries}
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab={<span>CCbill</span>} key="ccbill">
                <CCbillSettingForm
                  submiting={settingUpdating}
                  onFinish={this.updatePaymentGatewaySetting.bind(this)}
                  ccbillSetting={performer.ccbillSetting}
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab={<span>Commission</span>} key="commission">
                <CommissionSettingForm
                  submiting={settingUpdating}
                  onFinish={this.updateCommissionSetting.bind(this)}
                  commissionSetting={performer.commissionSetting}
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab={<span>Change password</span>} key="password">
                <UpdatePaswordForm onFinish={this.updatePassword.bind(this)} updating={pwUpdating} />
              </Tabs.TabPane>
            </Tabs>
          )}
        </Page>
      </Layout>
    );
  }
}

export default PerformerUpdate;
