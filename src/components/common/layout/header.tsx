import { PureComponent } from 'react';
import {
  Layout, Menu, Avatar, Dropdown
} from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import Link from 'next/link';
import './header.less';
import { IUser } from 'src/interfaces';

interface IProps {
  collapsed?: boolean;
  onCollapseChange?: Function;
  currentUser?: IUser;
}

class Header extends PureComponent<IProps> {
  render() {
    const { collapsed, onCollapseChange, currentUser } = this.props;

    const rightContent = (
      <Dropdown overlay={(
        <Menu key="user" mode="horizontal">
          <Menu.Item key="settings">
            <Link href="/account/settings">
              <span>Update profile</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="SignOut">
            <Link href="/auth/logout">
              <a>Log out</a>
            </Link>
          </Menu.Item>
        </Menu>
      )}
      >
        <Avatar style={{ margin: '0 15px' }} src={currentUser.avatar || '/no-avatar.png'} />
      </Dropdown>
    );

    return (
      <Layout.Header className="header" id="layoutHeader">
        <div
          aria-hidden
          className="button"
          onClick={onCollapseChange.bind(this, !collapsed)}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </div>

        <div className="rightContainer">{rightContent}</div>
      </Layout.Header>
    );
  }
}

const mapState = (state: any) => ({ currentUser: state.user.current });
export default connect(mapState)(Header);
