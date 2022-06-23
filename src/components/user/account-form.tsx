/* eslint-disable no-template-curly-in-string */
import { PureComponent } from 'react';
import {
  Form, Input, Button, Select, Switch, Row, Col
} from 'antd';
import { IUser, ICountry } from 'src/interfaces';
import { AvatarUpload } from '@components/user/avatar-upload';
import { getGlobalConfig } from 'src/services';

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

const validateMessages = {
  required: 'This field is required!',
  types: {
    email: 'Not a valid email!',
    number: 'Not a valid number!'
  },
  number: {
    range: 'Must be between ${min} and ${max}'
  }
};

interface IProps {
  onFinish: Function;
  user?: IUser;
  updating?: boolean;
  options?: {
    uploadHeaders?: any;
    avatarUploadUrl?: string;
    onAvatarUploaded?: Function;
    beforeUpload?: Function;
    avatarUrl?: string
  };
  countries: ICountry[];
}

export class AccountForm extends PureComponent<IProps> {
  render() {
    const {
      onFinish, user, updating, options, countries
    } = this.props;
    const {
      uploadHeaders, avatarUploadUrl, beforeUpload
    } = options;
    return (
      <Form
        {...layout}
        name="nest-messages"
        onFinish={onFinish.bind(this)}
        validateMessages={validateMessages}
        initialValues={
          user || {
            country: 'US',
            status: 'active',
            gender: 'male',
            roles: ['user']
          }
        }
      >
        <Row>
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
              <Input />
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
              <Input />
            </Form.Item>
          </Col>
          <Col xs={12} md={12}>
            <Form.Item
              name="username"
              label="Username"
              rules={[{ required: true }, {
                pattern: new RegExp(/^[a-zA-Z0-9]+$/g),
                message: 'Username must contain only alphanumeric characters'
              }, { min: 3 }]}
            >
              <Input placeholder="Unique, lowercase alphanumeric characters" />
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
                },
                {
                  min: 3,
                  message: 'Display name must containt at least 3 characters'
                }
              ]}
              hasFeedback
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={24}>
            <Form.Item name="email" label="Email" rules={[{ type: 'email', required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={12} md={12}>
            <Form.Item
              name="country"
              label="Country"
              rules={[
                { required: true, message: 'Please select country!' }
              ]}
            >
              <Select showSearch optionFilterProp="label">
                {countries.map((country) => (
                  <Select.Option key={country.code} label={country.name} value={country.code}>
                    <img alt="flag" src={country.flag || '/no-image.jpg'} width="20px" />
                    {' '}
                    {country.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={12} md={12}>
            <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
              <Select>
                <Select.Option key="male" value="male">
                  Male
                </Select.Option>
                <Select.Option key="female" value="female">
                  Female
                </Select.Option>
                <Select.Option key="transgender" value="transgender">
                  Transgender
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
          {!user && [
            <Col md={12} xs={24} key="password">
              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: 'Please input your password!' },
                  {
                    min: 6,
                    message: 'Password must have minimum 6 characters'
                  }
                ]}
              >
                <Input.Password placeholder="Password" />
              </Form.Item>
            </Col>,
            <Col md={12} xs={24} key="confirmPasswrod">
              <Form.Item
                label="Confirm Password"
                name="confirmPasswrod"
                validateTrigger={['onChange', 'onBlur']}
                dependencies={['password']}
                hasFeedback
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
          <Col xs={12} md={12}>
            <Form.Item name="roles" label="Roles" rules={[{ required: true }]}>
              <Select mode="multiple">
                <Select.Option key="user" value="user">
                  User
                </Select.Option>
                <Select.Option key="admin" value="admin">
                  Admin
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={12} md={12}>
            <Form.Item name="status" label="Status">
              <Select>
                <Select.Option key="active" value="active">
                  Active
                </Select.Option>
                <Select.Option key="inactive" value="inactive">
                  Inactive
                </Select.Option>
                <Select.Option key="pending-email-confirmation" disabled value="pending-email-confirmation">
                  Pending email confirmation
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={12} md={12}>
            <Form.Item name="verifiedEmail" label="Verified Email?" valuePropName="checked" help="Turn on if email account verified">
              <Switch />
            </Form.Item>
          </Col>
          <Col xs={12} md={12}>
            <Form.Item
              label="Avatar"
              help={`Avatar must be smaller than ${getGlobalConfig().NEXT_PUBLIC_MAX_SIZE_IMAGE || 5}MB!`}
            >
              <AvatarUpload
                headers={uploadHeaders}
                uploadUrl={avatarUploadUrl}
                onBeforeUpload={beforeUpload}
                image={user?.avatar}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item className="text-center">
          <Button type="primary" htmlType="submit" loading={updating}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  }
}
