import {
  Form, Input, Button, Checkbox, Alert, Layout
} from 'antd';
import { PureComponent } from 'react';
import { connect } from 'react-redux';
import Head from 'next/head';
import { login } from '@redux/auth/actions';
import { getResponseError } from '@lib/utils';
import { getGlobalConfig } from 'src/services';
import Link from 'next/link';
import './index.less';

const FormItem = Form.Item;

interface IProps {
  loginAuth: any;
  ui: any;
  login: Function;
}

class Login extends PureComponent<IProps> {
  static layout: string = 'public';

  static authenticate: boolean = false;

  handleOk = (data) => {
    const { login: handlerLogin } = this.props;
    handlerLogin(data);
  };

  render() {
    const { ui } = this.props;
    const {
      loginAuth = { requesting: false, error: null, success: false }
    } = this.props;
    return (
      <Layout>
        <Head>
          <title>Login</title>
        </Head>
        <div className="form">
          <div className="logo">
            {ui.logo ? <div><img alt="logo" src={ui && ui.logo} /></div> : ui.siteName}
            <h2>Admin Panel</h2>
          </div>
          {loginAuth.error && (
            <Alert
              message="Error"
              description={getResponseError(loginAuth.error)}
              type="error"
            />
          )}
          {loginAuth.success ? (
            <Alert
              message="Login success"
              type="success"
              description="Redirecting..."
            />
          ) : (
            <Form
              onFinish={this.handleOk}
              initialValues={{
                email: '',
                password: '',
                remember: true
              }}
            >
              <FormItem
                hasFeedback
                name="username"
                validateTrigger={['onChange', 'onBlur']}
                rules={[
                  { required: true, message: 'Please input email or username!' }
                ]}
              >
                <Input
                  placeholder="Email address or Username"
                />
              </FormItem>
              <FormItem
                hasFeedback
                name="password"
                validateTrigger={['onChange', 'onBlur']}
                rules={[
                  { required: true, message: 'Please input your password!' }
                ]}
              >
                <Input.Password
                  placeholder="Password"
                />
              </FormItem>
              <div className="sub-para">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
                <Link href="/auth/forgot">
                  <a>Forgot password?</a>
                </Link>
              </div>
              <Button
                type="primary"
                onClick={this.handleOk}
                loading={loginAuth.requesting}
                htmlType="submit"
              >
                Sign in
              </Button>
            </Form>
          )}
        </div>
        <div className="footer" style={{ padding: '15px' }}>
          Version
          {' '}
          {getGlobalConfig().NEXT_PUBLIC_BUILD_VERSION}
          {' '}
          - Copyright
          {' '}
          {new Date().getFullYear()}
        </div>
      </Layout>
    );
  }
}

const mapStates = (state: any) => ({
  loginAuth: state.auth.login,
  ui: state.ui
});
const mapDispatch = { login };
export default connect(mapStates, mapDispatch)(Login);
