import Head from 'next/head';
import { PureComponent } from 'react';
import {
  message, Switch, Table, Layout, Input, Spin
} from 'antd';
import Page from '@components/common/layout/page';
import { utilsService, blockCountryService } from '@services/index';
import { BreadcrumbComponent } from '@components/common';

interface IProps {}

class BlockCountries extends PureComponent<IProps> {
  countries: any;

  state = {
    searching: false,
    submiting: false,
    countries: [] as any,
    blockCountries: [] as any
  };

  async componentDidMount() {
    this.searchCountry();
  }

  handleFilterCountry = async (q) => {
    this.setState({
      countries: this.countries.filter((c) => {
        const regex = new RegExp(q.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''), 'i');
        return regex.test(c.name);
      })
    });
  }

  async handleChange(value: boolean, countryCode: string) {
    if (value) {
      try {
        await this.setState({ submiting: true });
        await blockCountryService.create(countryCode);
      } catch (error) {
        message.error('error');
      } finally {
        this.setState({ submiting: false });
      }
    }
    if (!value) {
      try {
        await this.setState({ submiting: true });
        await blockCountryService.delete(countryCode);
      } catch (error) {
        message.error('error');
      } finally {
        this.setState({ submiting: false });
      }
    }
  }

  async searchCountry() {
    try {
      await this.setState({ searching: true });
      const [countries, blockCountries] = await Promise.all([
        utilsService.countriesList(),
        blockCountryService.search()
      ]);
      await this.setState({
        searching: false,
        countries: countries?.data,
        blockCountries: blockCountries?.data
      });
      this.countries = countries?.data;
    } catch (e) {
      message.error('An error occurred, please try again!');
      this.setState({ searching: false });
    }
  }

  render() {
    const {
      countries, searching, blockCountries, submiting
    } = this.state;
    const columns = [
      {
        title: 'Country',
        key: 'name',
        render: (record) => (
          <span>
            <img src={record.flag} width="50px" alt="flag" />
            &nbsp;
            {record.name}
          </span>
        )
      },
      {
        title: 'Country Code',
        dataIndex: 'code',
        key: 'code'
      },
      {
        title: 'Block',
        dataIndex: 'code',
        key: 'check',
        render: (code) => (
          <Switch
            disabled={submiting}
            defaultChecked={!!(blockCountries.length > 0 && blockCountries.find((c) => c.countryCode === code))}
            onChange={(val) => this.handleChange(val, code)}
          />
        )
      }
    ];
    return (
      <Layout>
        <Head>
          <title>Site Privacy</title>
        </Head>
        <BreadcrumbComponent breadcrumbs={[{ title: 'Site Privacy' }]} />
        <Page>

          <Input.Search placeholder="Type to search country here" enterButton="Search" onSearch={this.handleFilterCountry} allowClear />

          <div style={{ margin: '15px 0' }}>
            {searching && <div className="text-center" style={{ margin: '20px' }}><Spin /></div>}
            {countries && countries.length > 0 && (
              <div className="table-responsive">
                <Table
                  pagination={false}
                  dataSource={countries.map((c, index) => {
                    const d = c;
                    d.key = index;
                    return d;
                  })}
                  columns={columns}
                />
              </div>
            )}
          </div>
        </Page>
      </Layout>
    );
  }
}

export default BlockCountries;
