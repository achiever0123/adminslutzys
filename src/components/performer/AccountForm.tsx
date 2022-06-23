import { PureComponent, createRef } from 'react';
import {
  Form, Input, Button, Select, message, Switch, Row, Col, DatePicker
} from 'antd';
import {
  IPerformer, ICountry, ILangguges, IPhoneCodes, IBody
} from 'src/interfaces';
import { AvatarUpload } from '@components/user/avatar-upload';
import { CoverUpload } from '@components/user/cover-upload';
import { authService, performerService, utilsService } from '@services/index';
import Router from 'next/router';
import moment from 'moment';
import './index.less';

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

const { TextArea } = Input;
const { Option } = Select;

interface IProps {
  onFinish: Function;
  onUploaded: Function;
  performer?: IPerformer;
  submiting: boolean;
  countries: ICountry[];
  languages: ILangguges[];
  phoneCodes: IPhoneCodes[];
  avatarUrl?: string;
  coverUrl?: string;
  bodyInfo: IBody;
}

export class AccountForm extends PureComponent<IProps> {
  state = {
    selectedPhoneCode: '+1',
    dateOfBirth: '',
    states: [],
    cities: []
  }

  formRef: any;

  componentDidMount() {
    const { performer } = this.props;
    if (performer?.country) {
      this.handleGetStates(performer?.country);
      if (performer?.state) {
        this.handleGetCities(performer?.state, performer?.country);
      }
    }
  }

  handleGetStates = async (countryCode: string) => {
    const { performer } = this.props;
    const resp = await utilsService.statesList(countryCode);
    const eState = resp.data.find((s) => s === performer?.state);
    await this.setState({ states: resp.data });
    if (eState) {
      this.formRef.setFieldsValue({ state: eState });
    } else {
      this.formRef.setFieldsValue({ state: '', city: '' });
    }
  }

  handleGetCities = async (state: string, countryCode: string) => {
    const { performer } = this.props;
    const resp = await utilsService.citiesList(countryCode, state);
    await this.setState({ cities: resp.data });
    const eCity = resp.data.find((s) => s === performer?.city);
    if (eCity) {
      this.formRef.setFieldsValue({ city: eCity });
    } else {
      this.formRef.setFieldsValue({ city: '' });
    }
  }

  render() {
    if (!this.formRef) this.formRef = createRef();
    const {
      performer, onFinish, submiting, countries, onUploaded,
      avatarUrl, coverUrl, phoneCodes, languages, bodyInfo
    } = this.props;
    const {
      heights = [], weights = [], bodyTypes = [], genders = [], sexualOrientations = [], ethnicities = [],
      hairs = [], pubicHairs = [], eyes = [], butts = []
    } = bodyInfo;
    const {
      selectedPhoneCode, dateOfBirth, cities, states
    } = this.state;
    const uploadHeaders = {
      authorization: authService.getToken()
    };
    return (
      <Form
        {...layout}
        name="form-performer"
        onFinish={(payload) => {
          const values = payload;
          values.phoneCode = selectedPhoneCode;
          values.dateOfBirth = dateOfBirth;
          onFinish(values);
        }}
        onFinishFailed={() => message.error('Please complete the required fields')}
        initialValues={
          { ...performer } || ({
            country: 'US',
            status: 'active',
            gender: 'male',
            languages: ['en'],
            verifiedEmail: false,
            verifiedAccount: false,
            verifiedDocument: false
          })
        }
        ref={(ref) => { this.formRef = ref; }}
      >
        <Row>
          <Col xs={24} md={24}>
            <div
              className="top-profile"
              style={{
                position: 'relative',
                marginBottom: 25,
                backgroundImage:
                  coverUrl
                    ? `url('${coverUrl}')`
                    : "url('/banner-image.jpg')"
              }}
            >
              <div className="avatar-upload">
                <AvatarUpload
                  headers={uploadHeaders}
                  uploadUrl={performerService.getAvatarUploadUrl()}
                  onUploaded={onUploaded.bind(this, 'avatarId')}
                  image={avatarUrl}
                />
              </div>
              <div className="cover-upload">
                <CoverUpload
                  options={{ fieldName: 'cover' }}
                  image={performer && performer.cover ? performer.cover : ''}
                  headers={uploadHeaders}
                  uploadUrl={performerService.getCoverUploadUrl()}
                  onUploaded={onUploaded.bind(this, 'coverId')}
                />
              </div>
            </div>
          </Col>
          <Col xs={12} md={12}>
            <Form.Item
              name="firstName"
              label="First Name"
              validateTrigger={['onChange', 'onBlur']}
              rules={[
                { required: true, message: 'Please input your first name!' },
                {
                  pattern: new RegExp(
                    /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u
                  ),
                  message:
                    'First name can not contain number and special character'
                }
              ]}
            >
              <Input placeholder="First Name" />
            </Form.Item>
          </Col>
          <Col xs={12} md={12}>
            <Form.Item
              name="lastName"
              label="Last Name"
              validateTrigger={['onChange', 'onBlur']}
              rules={[
                { required: true, message: 'Please input your last name!' },
                {
                  pattern: new RegExp(
                    /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u
                  ),
                  message:
                    'Last name can not contain number and special character'
                }
              ]}
            >
              <Input placeholder="Last Name" />
            </Form.Item>
          </Col>
          <Col xs={12} md={12}>
            <Form.Item
              name="name"
              label="Display name"
              validateTrigger={['onChange', 'onBlur']}
              rules={[
                { required: true, message: 'Please input your display name!' },
                {
                  pattern: new RegExp(/^(?=.*\S).+$/g),
                  message:
                    'Display name can not contain only whitespace'
                }
              ]}
              hasFeedback
            >
              <Input placeholder="Display name" />
            </Form.Item>
          </Col>
          <Col xs={12} md={12}>
            <Form.Item
              name="username"
              label="Username"
              rules={[{ required: true },
                {
                  pattern: new RegExp(/^[a-zA-Z0-9]+$/g),
                  message: 'Username must contain only alphanumerics'
                }, { min: 3 }]}
            >
              <Input placeholder="Unique, alphanumeric only" />
            </Form.Item>
          </Col>
          <Col xs={12} md={12}>
            <Form.Item name="email" label="Email" rules={[{ type: 'email', required: true }]}>
              <Input placeholder="Email address" />
            </Form.Item>
          </Col>
          <Col xs={12} md={12}>
            <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
              <Select>
                {genders.map((g) => (
                  <Select.Option key={g.value} value={g.value}>
                    {g.text}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={24}>
            <Form.Item name="bio" label="Bio">
              <TextArea rows={3} minLength={1} />
            </Form.Item>
          </Col>
          {!performer && [
            <Col xs={12} md={12}>
              <Form.Item key="password" name="password" label="Password" rules={[{ required: true }, { min: 6 }]}>
                <Input.Password placeholder="Password" />
              </Form.Item>
            </Col>,
            <Col xs={12} md={12}>
              <Form.Item
                key="rePassword"
                name="rePassword"
                label="Confirm password"
                rules={[
                  {
                    required: true,
                    message: 'Please confirm your password!'
                  },
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      // eslint-disable-next-line prefer-promise-reject-errors
                      return Promise.reject('Passwords do not match together!');
                    }
                  })
                ]}
              >
                <Input.Password placeholder="Confirm password" />
              </Form.Item>
            </Col>
          ]}
          <Col md={12} xs={12}>
            <Form.Item
              label="Date of Birth"
              validateTrigger={['onChange', 'onBlur']}
            >
              <DatePicker
                placeholder="YYYY-MM-DD"
                defaultValue={performer?.dateOfBirth ? moment(performer.dateOfBirth) as any : ''}
                onChange={(date) => this.setState({ dateOfBirth: date })}
                disabledDate={(currentDate) => currentDate && currentDate > moment().subtract(12, 'year').endOf('day')}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col xs={12} md={12}>
            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[
                {
                  pattern: new RegExp(/^[0-9]{9,12}$/),
                  message: 'Enter 9-12 digits phone number'
                }
              ]}
            >
              <Input
                placeholder="9-12 digits phone number"
                addonBefore={(
                  <Select style={{ minWidth: 120 }} defaultValue={performer?.phoneCode || '+1'} optionFilterProp="label" showSearch onChange={(val) => this.setState({ selectedPhoneCode: val })}>
                    {phoneCodes && phoneCodes.map((p) => <Option key={p.code} value={p.code} label={`${p.code} ${p.name}`}>{`${p.code} ${p.name}`}</Option>)}
                  </Select>
                )}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={24}>
            <Form.Item
              name="languages"
              label="Languages"
            >
              <Select mode="multiple">
                {languages.map((l) => (
                  <Select.Option key={l.code} value={l.name || l.code}>
                    {l.name}
                  </Select.Option>
                ))}
              </Select>
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
                  <Option value={c.code} label={c.name} key={c.code}>
                    <img alt="country_flag" src={c.flag} width="25px" />
                    {' '}
                    {c.name}
                  </Option>
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
                  <Option value={state} label={state} key={state}>
                    {state}
                  </Option>
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
                  <Option value={city} label={city} key={city}>
                    {city}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={12} md={12}>
            <Form.Item name="address" label="Address">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={12} md={12}>
            <Form.Item name="zipcode" label="Zipcode">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={12} md={12}>
            <Form.Item name="sexualPreference" label="Sexual orientation">
              <Select>
                {sexualOrientations.map((g) => (
                  <Select.Option key={g.value} value={g.value}>
                    {g.text}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={12} md={12}>
            <Form.Item name="ethnicity" label="Ethnicity">
              <Select>
                {ethnicities.map((g) => (
                  <Select.Option key={g.value} value={g.value}>
                    {g.text}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={12} md={12}>
            <Form.Item name="bodyType" label="Body Type">
              <Select>
                {bodyTypes.map((g) => (
                  <Select.Option key={g.value} value={g.value}>
                    {g.text}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={12} md={12}>
            <Form.Item name="eyes" label="Eye color">
              <Select>
                {eyes.map((g) => (
                  <Select.Option key={g.value} value={g.value}>
                    {g.text}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={12} md={12}>
            <Form.Item name="hair" label="Hair color">
              <Select>
                {hairs.map((g) => (
                  <Select.Option key={g.value} value={g.value}>
                    {g.text}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={12} md={12}>
            <Form.Item name="height" label="Height">
              <Select showSearch>
                {heights.map((h) => (
                  <Option key={h.text} value={h.text}>
                    {h.text}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={12} md={12}>
            <Form.Item name="weight" label="Weight">
              <Select showSearch>
                {weights.map((w) => (
                  <Option key={w.text} value={w.text}>
                    {w.text}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={12} md={12}>
            <Form.Item name="butt" label="Butt size">
              <Select>
                {butts.map((g) => (
                  <Select.Option key={g.value} value={g.value}>
                    {g.text}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={12} md={12}>
            <Form.Item name="pubicHair" label="Pubic hair">
              <Select>
                {pubicHairs.map((g) => (
                  <Select.Option key={g.value} value={g.value}>
                    {g.text}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={8} md={8}>
            <Form.Item name="verifiedEmail" label="Verified Email?" valuePropName="checked" help="Turn on if email account verified">
              <Switch />
            </Form.Item>
          </Col>
          <Col xs={8} md={8}>
            <Form.Item name="verifiedDocument" label="Verified ID Documents?" valuePropName="checked" help="Accept model to start posting contents">
              <Switch />
            </Form.Item>
          </Col>
          <Col xs={8} md={8}>
            <Form.Item name="verifiedAccount" label="Verified Account?" valuePropName="checked" help="Display verification tick beside model name">
              <Switch />
            </Form.Item>
          </Col>
          <Col xs={24} md={24}>
            <Form.Item name="status" label="Status" rules={[{ required: true }]}>
              <Select>
                <Select.Option key="active" value="active">
                  Active
                </Select.Option>
                <Select.Option key="inactive" value="inactive">
                  Inactive
                </Select.Option>
                <Select.Option key="pending-email-confirmation" value="pending-email-confirmation" disabled>
                  Pending email confirmation
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={24}>
            <Form.Item className="text-center">
              <Button type="primary" htmlType="submit" disabled={submiting} loading={submiting}>
                Submit
              </Button>
              &nbsp;
              <Button onClick={() => Router.back()} disabled={submiting} loading={submiting}>
                Back
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
