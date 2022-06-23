/* eslint-disable no-template-curly-in-string */
import { PureComponent, createRef } from 'react';
import {
  Form, Input, Button, Select, message, Row, Col
} from 'antd';
import { utilsService } from 'src/services';
import { IBankingSetting, ICountry } from 'src/interfaces';

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

const validateMessages = {
  required: 'This field is required!',
  types: {
    email: 'Not a validate email!',
    number: 'Not a validate number!'
  },
  number: {
    range: 'Must be between ${min} and ${max}'
  }
};

interface IProps {
  onFinish: Function;
  bankingInformation?: IBankingSetting;
  submiting?: boolean;
  countries: ICountry[];
}

export class BankingForm extends PureComponent<IProps> {
  state ={
    states: [],
    cities: []
  }

  formRef: any;

  componentDidMount() {
    const { bankingInformation } = this.props;
    if (bankingInformation?.country) {
      this.handleGetStates(bankingInformation?.country);
      if (bankingInformation?.state) {
        this.handleGetCities(bankingInformation?.state, bankingInformation?.country);
      }
    }
  }

  handleGetStates = async (countryCode: string) => {
    const { bankingInformation } = this.props;
    const resp = await utilsService.statesList(countryCode);
    await this.setState({ states: resp.data });
    const eState = resp.data.find((s) => s === bankingInformation?.state);
    if (eState) {
      this.formRef.setFieldsValue({ state: eState });
    } else {
      this.formRef.setFieldsValue({ state: '', city: '' });
    }
  }

  handleGetCities = async (state: string, countryCode: string) => {
    const { bankingInformation } = this.props;
    const resp = await utilsService.citiesList(countryCode, state);
    await this.setState({ cities: resp.data });
    const eCity = resp.data.find((s) => s === bankingInformation?.city);
    if (eCity) {
      this.formRef.setFieldsValue({ city: eCity });
    } else {
      this.formRef.setFieldsValue({ city: '' });
    }
  }

  render() {
    if (!this.formRef) this.formRef = createRef();
    const {
      bankingInformation, onFinish, submiting, countries
    } = this.props;
    const { states, cities } = this.state;

    return (
      <Form
        {...layout}
        name="form-banking-performer"
        onFinish={onFinish.bind(this)}
        onFinishFailed={() => message.error('Please complete the required fields')}
        validateMessages={validateMessages}
        initialValues={
          bankingInformation || ({
            firstName: '',
            lastName: '',
            SSN: '',
            bankName: '',
            bankAccount: '',
            bankRouting: '',
            bankSwiftCode: '',
            address: '',
            city: '',
            state: '',
            country: ''
          } as IBankingSetting)
        }
        ref={(ref) => { this.formRef = ref; }}
      >
        <Row>
          <Col md={12} xs={24}>
            <Form.Item name="bankName" label="Bank Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col md={12} xs={24}>
            <Form.Item name="bankAccount" label="Bank Account" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col md={12} xs={24}>
            <Form.Item name="firstName" label="First Name" required>
              <Input />
            </Form.Item>
          </Col>
          <Col md={12} xs={24}>
            <Form.Item name="lastName" label="Last Name" required>
              <Input />
            </Form.Item>
          </Col>
          <Col md={12} xs={24}>
            <Form.Item name="SSN" label="SSN">
              <Input />
            </Form.Item>
          </Col>
          <Col md={12} xs={24}>
            <Form.Item name="bankRouting" label="Routing Number">
              <Input />
            </Form.Item>
          </Col>
          <Col md={12} xs={24}>
            <Form.Item name="bankSwiftCode" label="Swift Code">
              <Input />
            </Form.Item>
          </Col>
          <Col md={12} sm={12} xs={12}>
            <Form.Item name="country" rules={[{ required: true, message: 'Please select your country' }]} label="Country">
              <Select
                placeholder="Select your country"
                optionFilterProp="label"
                showSearch
                onChange={(val: string) => this.handleGetStates(val)}
              >
                {countries.map((c) => (
                  <Select.Option value={c.code} label={c.name} key={c.code}>
                    <img alt="country_flag" src={c.flag} width="25px" />
                    {' '}
                    {c.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col md={12} sm={12} xs={12}>
            <Form.Item name="state" label="State">
              <Select
                placeholder="Select your state"
                optionFilterProp="label"
                showSearch
                onChange={(val: string) => this.handleGetCities(val, this.formRef.getFieldValue('country'))}
              >
                {states.map((state) => (
                  <Select.Option value={state} label={state} key={state}>
                    {state}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col md={12} sm={12} xs={12}>
            <Form.Item name="city" label="City">
              <Select
                placeholder="Select your city"
                optionFilterProp="label"
                showSearch
              >
                {cities.map((city) => (
                  <Select.Option value={city} label={city} key={city}>
                    {city}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col md={12} xs={24}>
            <Form.Item name="address" label="Address">
              <Input />
            </Form.Item>
          </Col>
          <Col md={24} xs={24}>
            <Form.Item className="text-center">
              <Button type="primary" htmlType="submit" disabled={submiting} loading={submiting}>
                Submit
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
