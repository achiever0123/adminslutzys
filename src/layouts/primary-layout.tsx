import { PureComponent } from 'react';
import { Layout, Drawer, BackTop } from 'antd';
import { enquireScreen, unenquireScreen } from 'enquire-js';
import { connect } from 'react-redux';
import { updateUIValue, loadUIValue } from 'src/redux/ui/actions';
import Sider from '@components/common/layout/sider';
import { IUIConfig } from 'src/interfaces/ui-config';
import {
  PieChartOutlined,
  ContainerOutlined,
  UserOutlined,
  WomanOutlined,
  VideoCameraOutlined,
  CameraOutlined,
  FileImageOutlined,
  SkinOutlined,
  DollarOutlined,
  HeartOutlined,
  MenuOutlined,
  MailOutlined,
  NotificationOutlined,
  FlagOutlined
} from '@ant-design/icons';
import Header from '@components/common/layout/header';
import { Router } from 'next/router';
import Loader from '@components/common/base/loader';

import './primary-layout.less';

interface DefaultProps extends IUIConfig {
  children: any;
  config: IUIConfig;
  updateUIValue: Function;
  loadUIValue: Function;
}

class PrimaryLayout extends PureComponent<DefaultProps> {
  state = {
    isMobile: false,
    routerChange: false
  };

  enquireHandler: any;

  componentDidMount() {
    const { loadUIValue: handleLoadUI } = this.props;
    handleLoadUI();
    this.enquireHandler = enquireScreen((mobile) => {
      const { isMobile } = this.state;
      if (isMobile !== mobile) {
        this.setState({
          isMobile: mobile
        });
      }
    });

    process.browser && this.handleStateChange();
  }

  componentWillUnmount() {
    unenquireScreen(this.enquireHandler);
  }

  handleStateChange() {
    Router.events.on('routeChangeStart', async () => this.setState({ routerChange: true }));
    Router.events.on('routeChangeComplete', async () => this.setState({ routerChange: false }));
  }

  onThemeChange = (theme: string) => {
    const { updateUIValue: updateUI } = this.props;
    updateUI({ theme });
  };

  onCollapseChange = (collapsed) => {
    const { updateUIValue: updateUI } = this.props;
    updateUI({ collapsed });
  };

  render() {
    const {
      children, collapsed, fixedHeader, logo, siteName, theme
    } = this.props;
    const { isMobile, routerChange } = this.state;
    const headerProps = {
      collapsed,
      theme,
      onCollapseChange: this.onCollapseChange
    };

    const sliderMenus = [
      {
        id: 'menu',
        name: 'Menu Options',
        icon: <MenuOutlined />,
        children: [
          {
            id: 'menu-listing',
            name: 'Existing Menu Options',
            route: '/menu'
          },
          {
            name: 'New Menu',
            id: 'create-menu',
            route: '/menu/create'
          }
        ]
      },
      {
        id: 'email-template',
        name: 'Email Templates',
        icon: <MailOutlined />,
        children: [
          {
            id: 'email-templates-listing',
            name: 'Email Templates',
            route: '/email-templates'
          }
        ]
      },
      {
        id: 'blockCountry',
        name: 'Site Privacy',
        icon: <PieChartOutlined />,
        children: [
          {
            id: 'blockCountries',
            name: 'Site Privacy',
            route: '/block-country'
          }
        ]
      },
      {
        id: 'posts',
        name: 'Posts',
        icon: <ContainerOutlined />,
        children: [
          {
            id: 'post-page',
            name: 'Posts created',
            route: '/posts?type=page'
          },
          {
            id: 'page-create',
            name: 'New Post',
            route: '/posts/create?type=page'
          }
        ]
      },
      {
        id: 'coupon',
        name: 'Coupons',
        icon: <DollarOutlined />,
        children: [
          {
            id: 'coupon-listing',
            name: 'Coupons Created ',
            route: '/coupon'
          },
          {
            name: 'New Coupon',
            id: 'create-coupon',
            route: '/coupon/create'
          }
        ]
      },
      {
        id: 'banner',
        name: 'Banners',
        icon: <FileImageOutlined />,
        children: [
          {
            id: 'banner-listing',
            name: 'Existing Banners',
            route: '/banner'
          },
          {
            name: 'New Banner',
            id: 'upload-banner',
            route: '/banner/upload'
          }
        ]
      },
      {
        id: 'report',
        name: 'Violations',
        icon: <FlagOutlined />,
        children: [
          {
            id: 'report-listing',
            name: 'Violations reported',
            route: '/report'
          }
        ]
      },
      {
        id: 'accounts',
        name: 'Users',
        icon: <UserOutlined />,
        children: [
          {
            name: 'User List',
            id: 'users',
            route: '/users'
          },
          {
            name: 'New User',
            id: 'users-create',
            route: '/users/create'
          }
        ]
      },
      {
        id: 'performers',
        name: 'Models',
        icon: <WomanOutlined />,
        children: [
          {
            name: 'Current Models',
            id: 'listing',
            route: '/performer'
          },
          {
            name: 'New Model',
            id: 'create-performer',
            route: '/performer/create'
          }
        ]
      },
      {
        id: 'videos',
        name: 'Videos',
        icon: <VideoCameraOutlined />,
        children: [
          {
            id: 'video-listing',
            name: 'Existing Videos',
            route: '/video'
          },
          {
            id: 'video-upload',
            name: 'New Video',
            route: '/video/upload'
          },
          {
            id: 'video-bulk-upload',
            name: 'Bulk Upload Videos',
            route: '/video/bulk-upload'
          }
        ]
      },
      {
        id: 'performers-galleries',
        name: 'Galleries',
        icon: <CameraOutlined />,
        children: [
          {
            id: 'gallery-listing',
            name: 'Existing Galleries',
            route: '/gallery'
          },
          {
            name: 'New Gallery',
            id: 'create-galleries',
            route: '/gallery/create'
          },
          {
            id: 'photo-listing',
            name: 'Photos',
            route: '/photos'
          },
          {
            name: 'Upload Photo',
            id: 'upload-photo',
            route: '/photos/upload'
          },
          {
            name: 'Bulk Upload Photos',
            id: 'bulk-upload-photo',
            route: '/photos/bulk-upload'
          }
        ]
      },
      {
        id: 'performers-products',
        name: 'Store',
        icon: <SkinOutlined />,
        children: [
          {
            id: 'categories-listing',
            name: 'Categories',
            route: '/categories'
          },
          {
            id: 'create-new',
            name: 'New Category',
            route: '/categories/create'
          },
          {
            id: 'product-listing',
            name: 'Inventory',
            route: '/product'
          },
          {
            name: 'New Product',
            id: 'create-product',
            route: '/product/create'
          }
        ]
      },
      {
        id: 'payments',
        name: 'Payment',
        icon: <DollarOutlined />,
        children: [
          {
            id: 'payment-listing',
            name: 'Payment History',
            route: '/payment'
          }
        ]
      },
      {
        id: 'payout-request',
        name: 'Payouts',
        icon: <NotificationOutlined />,
        children: [
          {
            id: 'request-payouts',
            name: 'Payout Requests',
            route: '/payout-request'
          }
        ]
      },
      {
        id: 'earning',
        name: 'Earnings',
        icon: <DollarOutlined />,
        children: [
          {
            id: 'earnings',
            name: 'Earnings Log',
            route: '/earning'
          }
        ]
      },
      {
        id: 'order',
        name: 'Orders',
        icon: <ContainerOutlined />,
        children: [
          {
            id: 'order-listing',
            name: 'Orders History',
            route: '/order'
          }
        ]
      },
      {
        id: 'subscription',
        name: 'Subscriptions',
        icon: <HeartOutlined />,
        children: [
          {
            name: 'Subscription History',
            id: 'sub-listing',
            route: '/subscription'
          },
          {
            name: 'New Subscription',
            id: 'create-subscription',
            route: '/subscription/create'
          }
        ]
      },
      {
        id: 'settings',
        name: 'Settings',
        icon: <PieChartOutlined />,
        children: [
          {
            id: 'system-settings',
            route: '/settings',
            as: '/settings',
            name: 'System Settings'
          }
        ]
      }
    ];
    const siderProps = {
      collapsed,
      isMobile,
      logo,
      siteName,
      theme,
      menus: sliderMenus,
      onCollapseChange: this.onCollapseChange,
      onThemeChange: this.onThemeChange
    };

    return (
      <>
        <Layout>
          {isMobile ? (
            <Drawer
              maskClosable
              closable={false}
              onClose={this.onCollapseChange.bind(this, !collapsed)}
              visible={!collapsed}
              placement="left"
              width={200}
              style={{
                padding: 0,
                height: '100vh'
              }}
            >
              <Sider {...siderProps} />
            </Drawer>
          ) : (
            <Sider {...siderProps} />
          )}
          <div className="container" style={{ paddingTop: fixedHeader ? 72 : 0 }} id="primaryLayout">
            <Header {...headerProps} />
            <Layout.Content className="content" style={{ position: 'relative' }}>
              {routerChange && <Loader spinning />}
              {/* <Bread routeList={newRouteList} /> */}
              {children}
            </Layout.Content>
            <BackTop className="backTop" target={() => document.querySelector('#primaryLayout') as any} />
          </div>
        </Layout>
      </>
    );
  }
}

const mapStateToProps = (state: any) => ({
  ...state.ui,
  auth: state.auth
});
const mapDispatchToProps = { updateUIValue, loadUIValue };

export default connect(mapStateToProps, mapDispatchToProps)(PrimaryLayout);
