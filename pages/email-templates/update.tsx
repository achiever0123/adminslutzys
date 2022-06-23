import Head from 'next/head';
import { PureComponent } from 'react';
import Page from '@components/common/layout/page';

import dynamic from 'next/dynamic';
import {
  Form, Input, Select, Button, Breadcrumb, message
} from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import Loader from '@components/common/base/loader';
import { emailTemplateService } from '@services/email-template.service';

const WYSIWYG = dynamic(() => import('@components/wysiwyg'), {
  ssr: false
});
class EmailTemplateUpdate extends PureComponent<any, any> {
  private _content: string = '';

  state = {
    submiting: false,
    fetching: true,
    template: null
  };

  static async getInitialProps({ ctx }) {
    const { query } = ctx;
    return query;
  }

  async componentDidMount() {
    try {
      const { id } = this.props;
      const resp = await emailTemplateService.findById(id);
      this._content = resp.data.content;
      this.setState({ template: resp.data });
    } catch (e) {
      message.error('Email template not found!');
    } finally {
      this.setState({ fetching: false });
    }
  }

  async submit(data: any) {
    try {
      this.setState({ submiting: true });
      const { id } = this.props;

      const submitData = {
        ...data,
        content: this._content
      };
      await emailTemplateService.update(id, submitData);
      message.success('Updated successfully');
      this.setState({ submiting: false });
    } catch (e) {
      // TODO - check and show error here
      message.error('Something went wrong, please try again!');
      this.setState({ submiting: false });
    }
  }

  contentChange(content: { [html: string]: string }) {
    this._content = content.html;
  }

  render() {
    const { template, fetching, submiting } = this.state;
    return (
      <>
        <Head>
          <title>Update template</title>
        </Head>
        <div style={{ marginBottom: '16px' }}>
          <Breadcrumb>
            <Breadcrumb.Item href="/">
              <HomeOutlined />
            </Breadcrumb.Item>
            <Breadcrumb.Item href="/email-templates">
              <span>Email templates</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{template?.name}</Breadcrumb.Item>
            <Breadcrumb.Item>Update</Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <Page>
          {!template || fetching ? (
            <Loader />
          ) : (
            <Form
              onFinish={this.submit.bind(this)}
              initialValues={template}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Form.Item
                name="subject"
                rules={[{ required: true, message: 'Please enter subject!' }]}
                label="Subject"
              >
                <Input placeholder="Enter your title" />
              </Form.Item>

              <Form.Item label="Content">
                <WYSIWYG
                  onChange={this.contentChange.bind(this)}
                  html={this._content}
                />
                {template?.description && <p><i>{template?.description}</i></p>}
              </Form.Item>
              <Form.Item
                name="layout"
                label="Layout"
              >
                <Select>
                  <Select.Option value="layouts/default">Default</Select.Option>
                  <Select.Option value="blank">Blank</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item wrapperCol={{ offset: 4 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={submiting}
                  loading={submiting}
                >
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

export default EmailTemplateUpdate;
