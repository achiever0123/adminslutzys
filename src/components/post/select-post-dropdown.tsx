import { PureComponent } from 'react';
import { Select } from 'antd';
import { sortBy } from 'lodash';
import { postService } from '@services/post.service';

const { Option } = Select;

interface IProps {
  placeholder?: string;
  style?: Record<string, string>;
  defaultValue?: any;
  onSelect: Function;
  disabled?: boolean;
}

export class SelectPostDropdown extends PureComponent<IProps> {
  _initalData = [];

  state = {
    data: [] as any,
    value: undefined
  };

  componentDidMount() {
    this.loadPosts();
  }

  handleSearch = (value) => {
    const q = value.toLowerCase();
    const filtered = this._initalData.filter((p) => p.slug.includes(q) || (p.title || '').toLowerCase().includes(q));
    this.setState({ data: filtered });
  };

  async loadPosts() {
    // TODO - should check for better option?
    const resp = await postService.search({ limit: 200 });
    this._initalData = sortBy(resp.data.data, (i) => i.slug);
    this.setState({
      data: [...this._initalData]
    });
  }

  render() {
    const {
      disabled, placeholder, style, onSelect, defaultValue
    } = this.props;
    const { value, data } = this.state;
    return (
      <Select
        showSearch
        value={value}
        placeholder={placeholder}
        style={style}
        defaultActiveFirstOption={false}
        showArrow
        filterOption={false}
        onSearch={this.handleSearch}
        onChange={onSelect.bind(this)}
        notFoundContent={null}
        defaultValue={defaultValue || undefined}
        disabled={disabled}
        allowClear
      >
        {data.map((p) => (
          <Option key={p._id} value={p.slug || p._id}>
            <span>
              <span>{p.title || p.slug || p._id}</span>
            </span>
          </Option>
        ))}
      </Select>
    );
  }
}
