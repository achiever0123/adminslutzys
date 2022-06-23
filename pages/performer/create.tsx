import Head from 'next/head';
import { PureComponent } from 'react';
import { message } from 'antd';
import Page from '@components/common/layout/page';
import {
  ICountry, ILangguges, IPhoneCodes
} from 'src/interfaces';
import Router from 'next/router';
import { performerService } from '@services/index';
import { utilsService } from '@services/utils.service';
import { validateUsername, getResponseError } from '@lib/utils';
import { AccountForm } from '@components/performer/AccountForm';
import { BreadcrumbComponent } from '@components/common';

interface IProps {
  countries: ICountry[];
  languages: ILangguges[];
  phoneCodes: IPhoneCodes[];
  heights: any;
  weights: any;
  bodyInfo: any;
}
class PerformerCreate extends PureComponent<IProps> {
  static async getInitialProps() {
    const [countries, languages, phoneCodes, bodyInfo] = await Promise.all([
      utilsService.countriesList(),
      utilsService.languagesList(),
      utilsService.phoneCodesList(),
      utilsService.bodyInfo()
    ]);
    return {
      countries: countries && countries.data ? countries.data : [],
      languages: languages && languages.data ? languages.data : [],
      phoneCodes: phoneCodes && phoneCodes.data ? phoneCodes.data : [],
      bodyInfo: bodyInfo?.data
    };
  }

  state = {
    creating: false,
    avatarUrl: '',
    coverUrl: ''
  };

  customFields = {};

  onUploaded(field: string, resp: any) {
    if (field === 'avatarId') {
      this.setState({ avatarUrl: resp.response.data.url });
    }
    if (field === 'coverId') {
      this.setState({ coverUrl: resp.response.data.url });
    }
    this.customFields[field] = resp.response.data._id;
  }

  async submit(data: any) {
    try {
      if (data.password !== data.rePassword) {
        message.error('Confirm password mismatch!');
        return;
      }

      if (!validateUsername(data.username)) {
        message.error('Username must contain only alphanumeric characters ');
        return;
      }
      await this.setState({ creating: true });
      const resp = await performerService.create({
        ...data,
        ...this.customFields
      });
      message.success('Created successfully');
      Router.push(
        {
          pathname: '/performer',
          query: { id: resp.data._id }
        },
        `/performer?id=${resp.data._id}`
      );
    } catch (e) {
      const err = (await Promise.resolve(e)) || {};
      message.error(getResponseError(err) || 'An error occurred, please try again!');
      this.setState({ creating: false });
    }
  }

  render() {
    const { creating, avatarUrl, coverUrl } = this.state;
    const {
      countries, languages, phoneCodes, bodyInfo
    } = this.props;
    return (
      <>
        <Head>
          <title>New Model</title>
        </Head>
        <BreadcrumbComponent
          breadcrumbs={[{ title: 'Performers', href: '/performer' }, { title: 'New model' }]}
        />
        <Page>
          <AccountForm
            onUploaded={this.onUploaded.bind(this)}
            onFinish={this.submit.bind(this)}
            submiting={creating}
            countries={countries}
            languages={languages}
            avatarUrl={avatarUrl}
            coverUrl={coverUrl}
            bodyInfo={bodyInfo}
            phoneCodes={phoneCodes}
          />
        </Page>
      </>
    );
  }
}

export default PerformerCreate;
