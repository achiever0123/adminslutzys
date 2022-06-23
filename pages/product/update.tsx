import Head from 'next/head';
import { PureComponent } from 'react';
import Page from '@components/common/layout/page';
import { Layout, message } from 'antd';
import { productService } from '@services/product.service';
import { IProduct } from 'src/interfaces';
import Loader from '@components/common/base/loader';
import { BreadcrumbComponent } from '@components/common';
import { FormProduct } from '@components/product/form-product';
import Router from 'next/router';

interface IProps {
  id: string;
}

interface IFiles {
  fieldname: string;
  file: File;
}

class ProductUpdate extends PureComponent<IProps> {
  state = {
    submiting: false,
    fetching: true,
    product: {} as IProduct,
    uploadPercentage: 0
  };

  static async getInitialProps({ ctx }) {
    return ctx.query;
  }

  _files: {
    digitalFile: File;
  } = {
    digitalFile: null
  };

  async componentDidMount() {
    const { id } = this.props;
    try {
      const resp = await productService.findById(id);
      this.setState({ product: resp.data });
    } catch (e) {
      message.error('Product not found!');
    } finally {
      this.setState({ fetching: false });
    }
  }

  onUploading(resp: any) {
    if (this._files.digitalFile) {
      this.setState({ uploadPercentage: resp.percentage });
    }
  }

  beforeUpload(file: File) {
    this._files.digitalFile = file;
  }

  async submit(data: any) {
    const { id } = this.props;
    try {
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
      await this.setState({ submiting: true });
      await productService.update(
        id,
        files,
        data,
        this.onUploading.bind(this)
      );
      message.success('Updated successfully');
      Router.push('/product');
    } catch (e) {
      const err = await e;
      message.error(err?.message || 'Something went wrong, please try again!');
      this.setState({ submiting: false });
    }
  }

  render() {
    const {
      product, submiting, fetching, uploadPercentage
    } = this.state;
    return (
      <Layout>
        <Head>
          <title>Update Product</title>
        </Head>
        <BreadcrumbComponent
          breadcrumbs={[
            { title: 'Product', href: '/product' },
            { title: product.name ? product.name : 'Detail product' },
            { title: 'Update' }
          ]}
        />
        <Page>
          {fetching ? (
            <Loader />
          ) : (
            <FormProduct
              product={product}
              submit={this.submit.bind(this)}
              uploading={submiting}
              beforeUpload={this.beforeUpload.bind(this)}
              uploadPercentage={uploadPercentage}
            />
          )}
        </Page>
      </Layout>
    );
  }
}

export default ProductUpdate;
