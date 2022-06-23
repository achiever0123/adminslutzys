import Head from 'next/head';
import { PureComponent } from 'react';
import Page from '@components/common/layout/page';
import { Layout, message } from 'antd';
import { galleryService } from '@services/gallery.service';
import { FormGallery } from '@components/gallery/form-gallery';
import { BreadcrumbComponent } from '@components/common';
import Router from 'next/router';

class GalleryCreate extends PureComponent {
  state = {
    submiting: false
  };

  async submit(data: any) {
    try {
      await this.setState({ submiting: true });
      const submitData = {
        ...data
      };
      await galleryService.create(submitData);
      message.success('Created successfully');
      // TODO - redirect
      Router.push('/gallery');
    } catch (e) {
      message.error('Something went wrong, please try again!');
      this.setState({ submiting: false });
    }
  }

  render() {
    const { submiting } = this.state;
    return (
      <Layout>
        <Head>
          <title>New Gallery</title>
        </Head>
        <BreadcrumbComponent
          breadcrumbs={[{ title: 'Galleries', href: '/gallery' }, { title: 'New gallery' }]}
        />
        <Page>
          <FormGallery onFinish={this.submit.bind(this)} submiting={submiting} />
        </Page>
      </Layout>
    );
  }
}

export default GalleryCreate;
