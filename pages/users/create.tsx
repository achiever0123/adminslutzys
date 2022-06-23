import Head from 'next/head';
import { PureComponent } from 'react';
import { message, Layout } from 'antd';
import Page from '@components/common/layout/page';
import { ICountry } from 'src/interfaces';
import Router from 'next/router';
import { userService, authService, utilsService } from '@services/index';
import { getResponseError } from '@lib/utils';
import { AccountForm } from '@components/user/account-form';
import { BreadcrumbComponent } from '@components/common';

interface IProps {
  countries: ICountry[];
}

class UserCreate extends PureComponent<IProps> {
  static async getInitialProps() {
    const resp = await utilsService.countriesList();
    return {
      countries: resp.data
    };
  }

  _avatar: File;

  state = {
    creating: false
  };

  onBeforeUpload(file) {
    this._avatar = file;
    return true;
  }

  async submit(data: any) {
    try {
      await this.setState({ creating: true });
      const resp = await userService.create(data);
      if (this._avatar) {
        await userService.uploadAvatarUser(this._avatar, resp.data._id);
      }

      message.success('Created successfully');
      Router.push('/users');
    } catch (e) {
      const err = await Promise.resolve(e);
      message.error(getResponseError(err) || 'An error occurred, please try again!');
      this.setState({ creating: false });
    }
  }

  render() {
    const { creating } = this.state;
    const { countries } = this.props;
    return (
      <Layout>
        <Head>
          <title>New user</title>
        </Head>
        <BreadcrumbComponent breadcrumbs={[{ title: 'Users', href: '/users' }, { title: 'New user' }]} />
        <Page>
          <AccountForm
            onFinish={this.submit.bind(this)}
            options={{
              beforeUpload: this.onBeforeUpload.bind(this)
            }}
            updating={creating}
            countries={countries}
          />
        </Page>
      </Layout>
    );
  }
}

export default UserCreate;
