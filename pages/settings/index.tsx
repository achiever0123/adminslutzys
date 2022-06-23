/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-restricted-syntax */
import Head from 'next/head';
import { PureComponent, createRef } from 'react';
import {
  Form, Menu, message, Button, Input, InputNumber, Switch, Checkbox
} from 'antd';
import Page from '@components/common/layout/page';
import { settingService } from '@services/setting.service';
import { ISetting } from 'src/interfaces';
import Loader from '@components/common/base/loader';
import { ImageUpload } from '@components/file/image-upload';
import { authService } from '@services/auth.service';
import { FormInstance } from 'antd/lib/form';
import { getResponseError } from '@lib/utils';
import dynamic from 'next/dynamic';
import { SelectPostDropdown } from '@components/post/select-post-dropdown';

const WYSIWYG = dynamic(() => import('@components/wysiwyg'), {
  ssr: false
});

class Settings extends PureComponent {
  state = {
    updating: false,
    loading: false,
    selectedTab: 'general',
    list: []
  };

  formRef: any;

  dataChange = {} as any;

  smtpInfo = {
    host: '',
    port: '',
    secure: true,
    auth: {
      user: '',
      password: ''
    }
  } as any;

  componentDidMount() {
    this.formRef = createRef();
    this.loadSettings();
  }

  async handleTextEditerContentChange(key: string, content: { [html: string]: string}) {
    this[key] = content.html;
    this.setVal(key, content.html);
    this.dataChange[key] = content.html;
  }

  async onMenuChange(menu) {
    await this.setState({
      selectedTab: menu.key
    });

    await this.loadSettings();
  }

  setVal(field: string, val: any) {
    this.dataChange[field] = val;
  }

  setObject(field: string, val: any) {
    if (field === 'user' || field === 'pass') {
      this.smtpInfo.auth[field] = val;
    }
    this.smtpInfo[field] = val;
    this.dataChange.smtpTransporter = this.smtpInfo;
  }

  async loadSettings() {
    const { selectedTab } = this.state;
    try {
      await this.setState({ loading: true });
      const resp = await settingService.all(selectedTab) as any;
      this.dataChange = {};
      if (selectedTab === 'mailer' && resp.data && resp.data.length) {
        const info = resp.data.find((data) => data.key === 'smtpTransporter');
        if (info) this.smtpInfo = info.value;
      }
      this.setState({ list: resp.data });
      if (selectedTab === 'general') {
        const textEditorSettings = resp.data.filter((r) => r.type === 'text-editor');
        if (textEditorSettings && textEditorSettings.length > 0) {
          textEditorSettings.map((t) => {
            this[t.key] = t.value;
            return t;
          });
        }
      }
    } catch (e) {
      const err = await Promise.resolve(e);
      message.error(getResponseError(err) || 'An error occurred, please try again!');
    } finally {
      this.setState({ loading: false });
    }
  }

  async submit() {
    try {
      await this.setState({ updating: true });
      for (const key of Object.keys(this.dataChange)) {
        if (key.indexOf('commission') !== -1) {
          if (!this.dataChange[key]) {
            return message.error('Missing commission value!');
          }
          if (Number.isNaN(this.dataChange[key])) {
            return message.error('Commission must be a number!');
          }
          if (this.dataChange[key] <= 0 || this.dataChange[key] >= 1) {
            return message.error('Commission must be greater than 0 and smaller than 1!');
          }
        }
        // eslint-disable-next-line no-await-in-loop
        await settingService.update(key, this.dataChange[key]);
      }
      return message.success('Updated setting successfully');
    } catch (e) {
      const err = await Promise.resolve(e);
      return message.error(getResponseError(err));
    } finally {
      this.setState({ updating: false });
    }
  }

  async verifyMailer() {
    try {
      this.setState({ updating: true });
      await settingService.verifyMailer();
      message.success('We\'ve sent and test email, please check your email inbox or spam folder');
    } catch (e) {
      const err = await Promise.resolve(e);
      message.error(err ? JSON.stringify(err) : 'Could not verify this SMTP transporter');
    } finally {
      this.setState({ updating: false });
    }
  }

  renderUpload(setting: ISetting, ref: any) {
    if (!setting.meta || !setting.meta.upload) {
      return null;
    }
    const uploadHeaders = {
      authorization: authService.getToken()
    };
    return (
      <div style={{ padding: '10px 0' }} key={`upload${setting._id}`}>
        <ImageUpload
          image={setting.value}
          uploadUrl={settingService.getFileUploadUrl()}
          headers={uploadHeaders}
          onUploaded={(resp) => {
            const formInstance = this.formRef.current as FormInstance;
            // eslint-disable-next-line no-param-reassign
            ref.current.input.value = resp.response.data.url;
            formInstance.setFieldsValue({
              [setting.key]: resp.response.data.url
            });
            this.dataChange[setting.key] = resp.response.data.url;
          }}
        />
      </div>
    );
  }

  renderFormItem(setting: ISetting) {
    const { updating } = this.state;
    let { type } = setting;
    if (setting.meta && setting.meta.textarea) {
      type = 'textarea';
    }
    const ref = createRef() as any;
    switch (type) {
      case 'textarea':
        return (
          <Form.Item label={setting.name} key={setting._id} help={setting.description}>
            <Input.TextArea defaultValue={setting.value} onChange={(val) => this.setVal(setting.key, val.target.value)} />
          </Form.Item>
        );
      case 'post':
        return (
          <Form.Item label={setting.name} key={setting._id} help={setting.description}>
            <SelectPostDropdown
              defaultValue={setting.value}
              onSelect={(val) => this.setVal(setting.key, val)}
            />
          </Form.Item>
        );
      case 'number':
        return (
          <Form.Item label={setting.name} key={setting._id} help={setting.description}>
            <InputNumber
              style={{ width: '100%' }}
              defaultValue={setting.value}
              onChange={(val) => this.setVal(setting.key, val)}
            />
          </Form.Item>
        );
      case 'text-editor':
        return (
          <Form.Item label={setting.name} key={setting._id} help={setting.description}>
            <WYSIWYG onChange={this.handleTextEditerContentChange.bind(this, setting.key)} html={this[setting.key]} />
          </Form.Item>
        );
      case 'boolean':
        return (
          <Form.Item label={setting.name} key={setting._id} help={setting.description} valuePropName="checked">
            <Switch defaultChecked={setting.value} onChange={(val) => this.setVal(setting.key, val)} />
          </Form.Item>
        );
      case 'mixed':
        return (
          <div className="ant-row ant-form-item ant-form-item-with-help" key={setting._id}>
            <div className="ant-col ant-col-24 ant-form-item-label">
              <label htmlFor={setting.name}>
                {setting.name}
              </label>
            </div>
            <div className="ant-col ant-col-24 ant-form-item-control">
              <div className="ant-form-item">
                <div>
                  <label htmlFor="host-name">
                    Host
                  </label>
                  <Input
                    defaultValue={setting?.value?.host}
                    onChange={(val) => this.setObject('host', val.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="port">Port</label>
                  <Input
                    defaultValue={setting?.value?.port}
                    onChange={(val) => this.setObject('port', val.target.value)}
                  />
                </div>
                <div style={{ margin: '10px 0' }}>
                  <label htmlFor="secure">
                    <Checkbox defaultChecked={setting?.value?.secure} onChange={(e) => this.setObject('secure', e.target.checked)} />
                    {' '}
                    Secure (true for port 465, false for other ports)
                  </label>
                </div>
                <div>
                  <label htmlFor="authuser">Auth user</label>
                  <Input
                    defaultValue={setting?.value?.auth?.user}
                    onChange={(val) => this.setObject('user', val.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="authpassword">Auth password</label>
                  <Input
                    defaultValue={setting?.value?.auth?.pass}
                    onChange={(val) => this.setObject('pass', val.target.value)}
                  />
                </div>
              </div>
              <div className="ant-form-item-explain">{setting.description}</div>

              <div>
                <Button disabled={updating} loading={updating} onClick={this.verifyMailer.bind(this)} type="link">Once saved, click here to verify SMTP then start using.</Button>
              </div>

            </div>
          </div>
        );
      default:
        return (
          <Form.Item label={setting.name} key={setting._id} help={setting.description}>
            <Input
              defaultValue={setting.value}
              ref={ref}
              key={`input${setting._id}`}
              onChange={(val) => this.setVal(setting.key, val.target.value)}
            />
            {this.renderUpload(setting, ref)}
          </Form.Item>
        );
    }
  }

  render() {
    const {
      updating, selectedTab, list, loading
    } = this.state;
    const layout = {
      labelCol: { span: 24 },
      wrapperCol: { span: 24 }
    };

    const initialValues = {} as any;
    list.forEach((item: ISetting) => {
      initialValues[item.key] = item.value;
    });
    return (
      <>
        <Head>
          <title>Site Settings</title>
        </Head>
        <Page>
          <div style={{ marginBottom: '20px' }}>
            <Menu onClick={this.onMenuChange.bind(this)} selectedKeys={[selectedTab]} mode="horizontal">
              <Menu.Item key="general">General</Menu.Item>
              <Menu.Item key="email">Emails</Menu.Item>
              <Menu.Item key="mailer">SMTP</Menu.Item>
              <Menu.Item key="custom">SEO</Menu.Item>
              <Menu.Item key="commission">Commission</Menu.Item>
              <Menu.Item key="ccbill">CCbill</Menu.Item>
              <Menu.Item key="verotel">Verotel</Menu.Item>
              <Menu.Item key="analytics">Google Analytics</Menu.Item>
            </Menu>
          </div>

          {loading ? (
            <Loader spinning />
          ) : (
            <Form
              {...layout}
              layout={selectedTab === 'commission' ? 'vertical' : 'horizontal'}
              name="setting-frm"
              onFinish={this.submit.bind(this)}
              initialValues={initialValues}
              ref={this.formRef}
            >
              {list.map((setting) => this.renderFormItem(setting))}
              <Form.Item className="text-center">
                <Button type="primary" htmlType="submit" disabled={updating} loading={updating}>
                  Submit
                </Button>
              </Form.Item>
            </Form>
          )}
        </Page>
      </>
    );
  }
}

export default Settings;
