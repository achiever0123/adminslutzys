import { PureComponent } from 'react';
import { Select, message, Avatar } from 'antd';
import { debounce } from 'lodash';
import { performerService } from '@services/performer.service';

interface IProps {
  placeholder?: string;
  style?: Record<string, string>;
  onSelect: Function;
  defaultValue?: string;
  disabled?: boolean;
  noEmpty?: boolean;
}

export class SelectPerformerDropdown extends PureComponent<IProps> {
  state = {
    loading: false,
    firstLoadDone: false,
    data: [] as any
  };

  loadPerformers = debounce(async (q) => {
    try {
      await this.setState({ loading: true });
      const resp = await (await performerService.search({ q, limit: 99 })).data;
      this.setState({
        data: resp.data, firstLoadDone: true
      });
    } catch (e) {
      const err = await e;
      message.error(err?.message || 'Error occured');
    } finally {
      this.setState({ loading: false, firstLoadDone: true });
    }
  }, 500);

  componentDidMount() {
    this.loadPerformers('');
  }

  render() {
    const {
      style, onSelect, defaultValue, disabled, noEmpty
    } = this.props;
    const { data, loading, firstLoadDone } = this.state;
    return (
      <>
        {firstLoadDone && (
        <Select
          showSearch
          defaultValue={defaultValue}
          placeholder="Type to search model here"
          style={style}
          onSearch={this.loadPerformers.bind(this)}
          onChange={(val) => onSelect(val)}
          loading={loading}
          optionFilterProp="children"
          disabled={disabled}
        >
          {!noEmpty && (
          <Select.Option value="" key="default">
            All models
          </Select.Option>
          )}
          {data && data.length > 0 && data.map((u) => (
            <Select.Option value={u._id} key={u._id} style={{ textTransform: 'capitalize' }}>
              <Avatar
                src={u?.avatar || '/no-avatar.png'}
                alt="avt"
              />
              {' '}
              {`${u?.name || u?.username || 'no_name'}`}
            </Select.Option>
          ))}
        </Select>
        )}
      </>
    );
  }
}
