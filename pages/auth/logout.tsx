import { Fragment, PureComponent } from 'react';
import { connect } from 'react-redux';

import './index.less';
import Head from 'next/head';
import { logout } from '@redux/auth/actions';
import Page from '@components/common/layout/page';

interface IProps {
  sLogout: { success: boolean; };
  logout: Function;
}

class Logout extends PureComponent<IProps> {
  static authenticate: boolean = false;

  componentDidMount() {
    const { logout: handleLogout } = this.props;
    handleLogout();
  }

  render() {
    return (
      <>
        <Head>
          <title>Log out</title>
        </Head>
        <Page>
          <span>Logout...</span>
        </Page>
      </>
    );
  }
}

const mapStates = (state: any) => ({
  sLogout: state.auth.logout
});
export default connect(mapStates, { logout })(Logout);
