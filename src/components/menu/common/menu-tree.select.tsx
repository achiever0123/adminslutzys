import { PureComponent } from 'react';
import { TreeSelect } from 'antd';
import { sortBy } from 'lodash';
import { menuService } from '@services/menu.service';
import { IMenuUpdate } from 'src/interfaces';
import * as _ from 'lodash';

interface IProps {
  placeholder?: string;
  style?: Record<string, string>;
  defaultValue?: any;
  onSelect: Function;
  disabled?: boolean;
  menu?: IMenuUpdate;
}

export class SelectMenuTreeDropdown extends PureComponent<IProps> {
  _initalData = [];

  state = {
    data: [] as any,
    value: undefined
  };

  componentDidMount() {
    this.loadMenus();
  }

  handleSearch = (value) => {
    const q = value.toLowerCase();
    const filtered = this._initalData.filter((p) => p.title.includes(q) || (p.title || '').toLowerCase().includes(q));
    this.setState({ data: this.mapDataNode(filtered) });
  };

  buildTree(data = [], parent?: any, tree?: any) {
    let a = tree;
    a = typeof a !== 'undefined' ? a : [];
    let b = parent;
    b = typeof b !== 'undefined' ? b : { _id: '' };
    const children = _.filter(data, (child) => (child.parentId || '') === b._id);
    if (!_.isEmpty(children)) {
      if (!b._id) {
        a = children;
      } else {
        b.children = children;
      }
      _.each(children, (child) => this.buildTree(data, child));
    }
    return this.mapDataNode(a);
  }

  async mapDataNode(data: any) {
    const { menu } = this.props;
    if (data && data.length > 0) {
      return Promise.all(
        data.map(async (item) => {
          let children = [];
          if (item.children) {
            children = await this.mapDataNode(item.children);
          }
          return {
            title: item.title,
            value: item._id,
            ordering: item.ordering,
            children: children.length > 0 ? _.orderBy(children, 'ordering', 'asc') : [],
            disabled: !!(menu && menu._id === item._id)
          };
        })
      );
    }
    return undefined;
  }

  async loadMenus() {
    // TODO - should check for better option?
    const resp = await menuService.search({ limit: 1000, sortBy: 'ordering', sort: 'asc' });
    this._initalData = sortBy(resp.data.data, (i) => i.title);
    this.setState({
      data: await this.buildTree(this._initalData)
    });
  }

  render() {
    const {
      disabled, style, defaultValue, placeholder, onSelect
    } = this.props;
    const { data, value } = this.state;
    return (
      <TreeSelect
        showSearch
        style={style || { width: '100%' }}
        value={defaultValue || value}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        treeData={data}
        placeholder={placeholder || 'Please select'}
        treeDefaultExpandAll
        onChange={(values) => {
          this.setState({ value: { values } });
          onSelect(value);
        }}
        onSearch={this.handleSearch}
        disabled={disabled}
        allowClear
      />
    );
  }
}
