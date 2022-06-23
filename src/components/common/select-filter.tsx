import { PureComponent } from 'react';
import {
  Select
} from 'antd';

interface IITemsFilter {
  key: string;
  value: string;
  text: string;
}

interface IOptions {
  keyFilter: string;
  type?: string;
}

interface IProps {
  options: IOptions;
  itemsFilter?: IITemsFilter[];
  onSelect?: Function;
}

export class SelectFilter extends PureComponent<IProps> {
  render() {
    const { itemsFilter, onSelect, options } = this.props;
    return (
      <Select
        onChange={(val) => onSelect(options.keyFilter, val)}
        style={{ width: '100%' }}
        placeholder={`Select${options.keyFilter}`}
        defaultValue=""
      >
        {itemsFilter.map((s) => (
          <Select.Option key={s.key} value={s.value}>
            {s.text}
          </Select.Option>
        ))}
      </Select>
    );
  }
}
