import { PureComponent } from 'react';
import {
  Table, Tag
} from 'antd';
import { formatDate } from '@lib/date';

interface IProps {
  dataSource: [];
  rowKey: string;
  loading: boolean;
  pagination: {};
  onChange: Function;
}

export class TableListPaymentTransaction extends PureComponent<IProps> {
  render() {
    const columns = [
      {
        title: 'Seller',
        key: 'seller',
        render(record) {
          return (
            <span>
              {record?.seller?.name || record?.seller?.username || 'N/A'}
            </span>
          );
        }
      },
      {
        title: 'Buyer',
        key: 'buyer',
        render(record) {
          return (
            <span>
              {record.buyer?.name || record?.buyer?.username || 'N/A'}
            </span>
          );
        }
      },
      {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
        render(type: number) {
          return <Tag color="orange">{type}</Tag>;
        }
      },
      {
        title: 'Description',
        render(data, record) {
          return record.details?.map((p) => (
            <p key={p._id}>
              <span>{p.name}</span>
            </p>
          ));
        }
      },
      {
        title: 'Total Price',
        dataIndex: 'totalPrice',
        render(data, record) {
          return (
            <span>
              $
              {record.totalPrice?.toFixed(2)}
            </span>
          );
        }
      },
      {
        title: 'Gateway',
        dataIndex: 'paymentGateway',
        render(paymentGateway: string) {
          switch (paymentGateway) {
            case 'ccbill':
              return <Tag color="blue">CCbill</Tag>;
            case 'verotel':
              return <Tag color="pink">Verotel</Tag>;
            default: return <Tag color="#FFCF00">{paymentGateway || 'CCbill'}</Tag>;
          }
        }
      },
      {
        title: 'Status',
        dataIndex: 'status',
        render(status: string) {
          switch (status) {
            case 'pending':
              return <Tag color="orange">Pending</Tag>;
            case 'paid':
              return <Tag color="green">Success</Tag>;
            case 'cancel':
              return <Tag color="red">Cancel</Tag>;
            default: return <Tag color="red">Pending</Tag>;
          }
        }
      },
      {
        title: 'Updated on',
        dataIndex: 'updatedAt',
        sorter: true,
        fixed: 'right' as 'right',
        render(date: Date) {
          return <span>{formatDate(date)}</span>;
        }
      }
    ];
    const {
      dataSource, rowKey, loading, pagination, onChange
    } = this.props;
    return (
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey={rowKey}
        loading={loading}
        pagination={pagination}
        onChange={onChange.bind(this)}
      />
    );
  }
}
