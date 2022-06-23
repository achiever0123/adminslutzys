/* eslint-disable no-multiple-empty-lines */
import { PureComponent } from 'react';
import { Menu } from 'antd';
import Link from 'next/link';
import Router from 'next/router';

interface IProps {
  theme?: string;
  isMobile?: boolean;
  menus?: any;
  collapsed?: boolean;
}

export class SiderMenu extends PureComponent<IProps> {
  state = {
    openKeys: []
  };

  componentDidMount() {
    // Router.events.on('routeChangeStart', this.routerChange.bind(this));
    const { menus } = this.props;
    const openKeys = this.getOpenKeys(menus);
    this.setState({ openKeys });
  }

  onOpenChange = (openKeys) => {
    const { menus } = this.props;
    const rootSubmenuKeys = menus.filter((_) => !_.menuParentId).map((_) => _.id);

    const latestOpenKey = openKeys.find(
      (key) => openKeys.indexOf(key) === -1
    );

    let newOpenKeys = openKeys;
    if (rootSubmenuKeys.indexOf(latestOpenKey) !== -1) {
      newOpenKeys = latestOpenKey ? [latestOpenKey] : [];
    }
    this.setState({
      openKeys: newOpenKeys
    });
  }

  getOpenKeys(menus: any) {
    const pathname = process.browser ? Router.pathname : '';
    const withoutQuery = pathname.split('?')[0];
    let found = false;
    let results = [];
    // TODO - optimize me if needed or more level
    menus.forEach((menu) => {
      if (found) return;
      const menuRoute = menu.route ? menu.route.split('?')[0] : '';
      if (menu.route === pathname || menuRoute === withoutQuery) {
        found = true;
        results = [menu.id];
        return;
      }
      if (menu.children) {
        menu.children.forEach((cmenu) => {
          if (found) return;
          const menuRoutes = cmenu.route ? cmenu.route.split('?')[0] : '';
          if (cmenu.route === pathname || menuRoutes === withoutQuery) {
            found = true;
            results = [menu.id];
          }
        });
      }
    });
    return results;
  }

  generateMenus = (data) => data.map((item) => {
    if (item.children) {
      return (
        <Menu.SubMenu
          key={item.id}
          title={(
            <>
              {item.icon}
              <span>{item.name}</span>
            </>
            )}
        >
          {this.generateMenus(item.children)}
        </Menu.SubMenu>
      );
    }
    return (
      <Menu.Item key={item.id}>
        {item.icon}
        <Link href={item.route} as={item.as || item.route}>
          <a>{item.name}</a>
        </Link>
      </Menu.Item>
    );
  })

  flatten(menus, flattenMenus = []) {
    menus.forEach((m) => {
      if (m.children) {
        this.flatten(m.children, flattenMenus);
      }
      const tmp = { ...m };
      delete tmp.children;
      flattenMenus.push(tmp);
    });

    return flattenMenus;
  }

  render() {
    const { theme, menus, collapsed } = this.props;
    const { openKeys } = this.state;
    const menuProps = collapsed
      ? {}
      : {
        openKeys
      };
    return (
      <Menu
        mode="inline"
        theme={theme as any}
        // selectedKeys={this.state.selectedKeys}
        openKeys={openKeys}
        onOpenChange={this.onOpenChange.bind(this)}
        // onClick={
        //   isMobile
        //     ? () => {
        //         onCollapseChange(true);
        //       }
        //     : undefined
        // }
        {...menuProps}
      >
        {this.generateMenus(menus)}
      </Menu>
    );
  }
}
