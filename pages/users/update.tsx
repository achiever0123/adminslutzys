import Head from 'next/head';
import { PureComponent } from 'react';
import { Tabs, message } from 'antd';
import Page from '@components/common/layout/page';
import { AccountForm } from '@components/user/account-form';
import { IUser, ICountry } from 'src/interfaces';
import { authService, userService } from '@services/index';
import { UpdatePaswordForm } from '@components/user/update-password-form';
import Loader from '@components/common/base/loader';
import { utilsService } from '@services/utils.service';
import { BreadcrumbComponent } from '@components/common';

interface IProps {
  id: string;
  countries: ICountry[];
}
class UserUpdate extends PureComponent<IProps> {
  static async getInitialProps({ ctx }) {
    const resp = await utilsService.countriesList();
    return {
      countries: resp.data,
      ...ctx.query
    };
  }

  state = {
    pwUpdating: false,
    updating: false,
    fetching: false,
    user: {} as IUser
  };

  async componentDidMount() {
    const { id } = this.props;
    try {
      this.setState({ fetching: true });
      const resp = await userService.findById(id);
      this.setState({ user: resp.data });
    } catch (e) {
      message.error('Error while fecting user!');
    } finally {
      this.setState({ fetching: false });
    }
  }

  onAvatarUploaded() {
    // TODO - check with current user if needed?
    message.success('Avatar has been updated!');
    // this.props.updateCurrentUserAvatar(data.base64);
  }

  async submit(data: any) {
    const { id } = this.props;
    try {
      this.setState({ updating: true });
      const updated = await userService.update(id, data);
      this.setState({ user: updated.data });
      message.success('Updated successfully');
    } catch (e) {
      // TODO - exact error message
      const error = await e;
      message.error(error && (error.message || 'An error occurred, please try again!'));
    } finally {
      this.setState({ updating: false });
    }
  }

  async updatePassword(data: any) {
    const { id } = this.props;
    try {
      this.setState({ pwUpdating: true });
      await authService.updatePassword(data.password, id, 'user');
      message.success('Password has been updated!');
    } catch (e) {
      message.error('An error occurred, please try again!');
    } finally {
      this.setState({ pwUpdating: false });
    }
  }

  render() {
    const {
      pwUpdating, user, updating, fetching
    } = this.state;
    const { countries } = this.props;
    const uploadHeaders = {
      authorization: authService.getToken()
    };
    return (
      <>
        <Head>
          <title>User update</title>
        </Head>
        <Page>
          <BreadcrumbComponent
            breadcrumbs={[{ title: 'Users', href: '/users' }, { title: 'Update' }]}
          />
          {fetching ? (
            <Loader />
          ) : (
            <Tabs defaultActiveKey="basic" tabPosition="top">
              <Tabs.TabPane tab={<span>Basic info</span>} key="basic">
                <AccountForm
                  onFinish={this.submit.bind(this)}
                  user={user}
                  updating={updating}
                  options={{
                    uploadHeaders,
                    avatarUploadUrl: userService.getAvatarUploadUrl(user._id),
                    onAvatarUploaded: this.onAvatarUploaded.bind(this)
                  }}
                  countries={countries}
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab={<span>Change password</span>} key="password">
                <UpdatePaswordForm onFinish={this.updatePassword.bind(this)} updating={pwUpdating} />
              </Tabs.TabPane>
            </Tabs>
          )}
        </Page>
      </>
    );
  }
}

export default UserUpdate;
