import Head from 'next/head';
import { PureComponent } from 'react';
import Page from '@components/common/layout/page';
import { message } from 'antd';
import { FormCategory } from '@components/category/form';
import { BreadcrumbComponent } from '@components/common';
import Router from 'next/router';
import './index.less';
import { categoryService } from '@services/category.service';

class categoryCreate extends PureComponent {
  state = {
    submiting: false
  };

  async submit(data: any) {
    try {
      await this.setState({ submiting: true });
      await categoryService.create(data);
      message.success('Created successfully');
      Router.push('/categories');
    } catch (e) {
      const err = await e;
      message.error(err?.message || 'Something went wrong, please try again!');
    } finally {
      this.setState({ submiting: false });
    }
  }

  render() {
    const { submiting } = this.state;
    return (
      <>
        <Head>
          <title>New category</title>
        </Head>
        <BreadcrumbComponent
          breadcrumbs={[{ title: 'Categories', href: '/categories' }, { title: 'New category' }]}
        />
        <Page>
          <FormCategory onFinish={this.submit.bind(this)} submiting={submiting} />
        </Page>
      </>
    );
  }
}

export default categoryCreate;
