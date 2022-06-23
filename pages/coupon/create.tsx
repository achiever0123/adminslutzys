import Head from 'next/head';
import { PureComponent } from 'react';
import Page from '@components/common/layout/page';
import { message } from 'antd';
import { couponService } from '@services/coupon.service';
import { FormCoupon } from '@components/coupon/form-coupon';
import { BreadcrumbComponent } from '@components/common';
import Router from 'next/router';

class CouponCreate extends PureComponent {
  state = {
    submiting: false
  };

  async submit(data: any) {
    try {
      this.setState({ submiting: true });

      const submitData = {
        ...data,
        value: data.value
      };
      await couponService.create(submitData);
      message.success('Created successfully');
      Router.push('/coupon');
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
          <title>New coupon</title>
        </Head>
        <BreadcrumbComponent breadcrumbs={[{ title: 'Coupons', href: '/coupon' }, { title: 'New coupon' }]} />
        <Page>
          <FormCoupon onFinish={this.submit.bind(this)} submiting={submiting} />
        </Page>
      </>
    );
  }
}

export default CouponCreate;
