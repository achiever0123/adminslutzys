import Head from 'next/head';
import { PureComponent } from 'react';
import Page from '@components/common/layout/page';
import dynamic from 'next/dynamic';
import {
  Form, Input, Button, Breadcrumb, message
} from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { postService } from '@services/post.service';
import Router from 'next/router';

const WYSIWYG = dynamic(() => import('@components/wysiwyg'), {
  ssr: false
});

class PostCreate extends PureComponent<any> {
  private _content: string = '';

  state = {
    submiting: false
  };

  async submit(data: any) {
    try {
      await this.setState({ submiting: true });
      const submitData = {
        ...data,
        content: this._content
      };
      await postService.create(submitData);
      message.success('Created successfully');
      Router.push('/posts');
    } catch (e) {
      message.error('Something went wrong, please try again!');
      this.setState({ submiting: false });
    }
  }

  contentChange(content: { [html: string]: string }) {
    this._content = content.html;
  }

  render() {
    const { submiting } = this.state;
    return (
      <>
        <Head>
          <title>New post</title>
        </Head>
        <div style={{ marginBottom: '16px' }}>
          <Breadcrumb>
            <Breadcrumb.Item href="/">
              <HomeOutlined />
            </Breadcrumb.Item>
            <Breadcrumb.Item href="/posts">
              <span>Posts</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>New post</Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <Page>
          <Form
            onFinish={this.submit.bind(this)}
            initialValues={{
              title: '',
              shortDescription: '',
              type: 'post',
              status: 'published',
              ordering: 0
            }}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Form.Item name="title" rules={[{ required: true, message: 'Please input title!' }]} label="Title">
              <Input placeholder="Enter your title" />
            </Form.Item>
            <Form.Item name="shortDescription" label="Short description">
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item label="Content">
              <WYSIWYG onChange={this.contentChange.bind(this)} html={this._content} />
            </Form.Item>
            {/* <Form.Item name="type" label="Type" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="page">Page</Select.Option>
                <Select.Option value="post">Post</Select.Option>
              </Select>
            </Form.Item> */}
            {/* <Form.Item name="status" label="Status" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="published">Active</Select.Option>
                <Select.Option value="inactive">Inactive</Select.Option>
              </Select>
            </Form.Item> */}
            <Form.Item wrapperCol={{ offset: 4 }}>
              <Button type="primary" htmlType="submit" disabled={submiting} loading={submiting}>
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Page>
      </>
    );
  }
}

export default PostCreate;
