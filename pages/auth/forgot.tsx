import {
  Form, Input, Button, Row, message
} from 'antd';
import { PureComponent } from 'react';
import { connect } from 'react-redux';
import Head from 'next/head';
import Link from 'next/link';
import { authService, getGlobalConfig } from '@services/index';
import Router from 'next/router';
import './index.less';

const FormItem = Form.Item;

interface IProps {
  ui: any;
}

class ForgotPassword extends PureComponent<IProps> {
  static layout: string = 'public';

  static authenticate: boolean = false;

  state = {
    submiting: false
  };

  handleReset = async (data) => {
    await this.setState({ submiting: true });
    try {
      await authService.resetPassword({
        ...data
      });
      message.success('Please check your inbox for instructions to reset the password.');

      Router.push('/auth/login');
    } catch (e) {
      const error = await e;
      message.error(error?.message || 'Error occured, please try again later');
    } finally {
      this.setState({ submiting: false });
    }
  };

  render() {
    const { ui } = this.props;
    const { submiting } = this.state;
    return (
      <>
        <Head>
          <title>Forgot password</title>
        </Head>
        <div className="form">
          <div className="logo">
            {ui.logo ? <div><img alt="logo" src={ui && ui.logo} /></div> : ui.siteName}
            <h2>Forgot Password</h2>
          </div>
          <Form
            onFinish={this.handleReset}
          >
            <FormItem
              hasFeedback
              name="email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email' }
              ]}
            >
              <Input
                placeholder="youremail@example.com"
              />
            </FormItem>
            <Row>
              <Button
                type="primary"
                loading={submiting}
                disabled={submiting}
                htmlType="submit"
              >
                Submit
              </Button>
            </Row>
          </Form>
          <p>
            <Link href="/auth/login">
              <a>Login</a>
            </Link>
          </p>
        </div>
        <div className="footer" style={{ padding: '15px' }}>
          Version
          {' '}
          {getGlobalConfig().NEXT_PUBLIC_BUILD_VERSION}
          {' '}
          - Copy right
          {' '}
          {new Date().getFullYear()}
        </div>
      </>
    );
  }
}

const mapStates = (state: any) => ({
  ui: state.ui
});
const mapDispatch = { };
export default connect(mapStates, mapDispatch)(ForgotPassword);
