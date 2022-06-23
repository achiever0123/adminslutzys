import Head from 'next/head';
import { PureComponent } from 'react';
import { message } from 'antd';
import Page from '@components/common/layout/page';
import { productService } from '@services/product.service';
import Router from 'next/router';
import { BreadcrumbComponent } from '@components/common';
import { FormProduct } from '@components/product/form-product';

interface IFiles {
  fieldname: string;
  file: File;
}

class CreateProduct extends PureComponent {
  state = {
    uploading: false,
    uploadPercentage: 0
  };

  _files: {
    digitalFile: File;
  } = {
    digitalFile: null
  };

  onUploading(resp: any) {
    this.setState({ uploadPercentage: resp.percentage });
  }

  beforeUpload(file: File) {
    this._files.digitalFile = file;
  }

  async submit(data: any) {
    if (data.type === 'digital' && !this._files.digitalFile) {
      message.error('Please select digital file!');
      return;
    }
    if (data.type === 'physical') {
      this._files.digitalFile = null;
    }
    const files = Object.keys(this._files).reduce((file, key) => {
      if (this._files[key]) {
        file.push({
          fieldname: key,
          file: this._files[key] || null
        });
      }
      return file;
    }, [] as IFiles[]) as [IFiles];
    await this.setState({
      uploading: true
    });
    try {
      await productService.createProduct(
        files,
        data,
        this.onUploading.bind(this)
      );
      message.success('Created success');
      Router.push('/product');
    } catch (error) {
      message.error('An error occurred, please try again!');
    } finally {
      this.setState({ uploading: false });
    }
  }

  render() {
    const { uploading, uploadPercentage } = this.state;
    return (
      <>
        <Head>
          <title>New product</title>
        </Head>
        <BreadcrumbComponent
          breadcrumbs={[
            { title: 'Products', href: '/product' },
            { title: 'New product' }
          ]}
        />
        <Page>
          <FormProduct
            submit={this.submit.bind(this)}
            beforeUpload={this.beforeUpload.bind(this)}
            uploading={uploading}
            uploadPercentage={uploadPercentage}
          />
        </Page>
      </>
    );
  }
}

export default CreateProduct;
