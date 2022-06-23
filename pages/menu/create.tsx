import Head from 'next/head';
import { PureComponent } from 'react';
import Page from '@components/common/layout/page';
import { message } from 'antd';
import { menuService } from '@services/menu.service';
import { FormMenu } from '@components/menu/form-menu';
import { BreadcrumbComponent } from '@components/common';
import Router from 'next/router';

class MenuCreate extends PureComponent {
  state = {
    submiting: false
  };

  async submit(data: any) {
    try {
      this.setState({ submiting: true });

      const submitData = {
        ...data,
        value: data.value / 100
      };
      await menuService.create(submitData);
      message.success('Created successfully');
      Router.push('/menu');
    } catch (e) {
      // TODO - check and show error here
      const err = (await Promise.resolve(e)) || {};
      message.error(err.message || 'Something went wrong, please try again!');
      this.setState({ submiting: false });
    }
  }

  render() {
    const { submiting } = this.state;
    return (
      <>
        <Head>
          <title>New menu</title>
        </Head>
        <BreadcrumbComponent breadcrumbs={[{ title: 'FE Menus', href: '/menu' }, { title: 'New menu' }]} />
        <Page>
          <FormMenu onFinish={this.submit.bind(this)} submiting={submiting} />
        </Page>
      </>
    );
  }
}

export default MenuCreate;
