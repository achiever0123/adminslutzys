import { PureComponent } from 'react';
import { Table, Tag } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { formatDate } from '@lib/date';
import Link from 'next/link';
import { DropdownAction } from '@components/common/dropdown-action';

interface IProps {
  dataSource: [];
  rowKey: string;
  loading: boolean;
  pagination: {};
  onChange: Function;
}

export class TableListEarning extends PureComponent<IProps> {
  render() {
    const columns = [
      {
        title: 'Model',
        dataIndex: 'performerInfo',
        key: 'performer',
        sorter: true,
        render(data, record) {
          return (
            <div>
              {record.performerInfo && record.performerInfo && record.performerInfo.username}
              {/* <br />
              {record.performerInfo && record.performerInfo && record.performerInfo.email} */}
            </div>
          );
        }
      },
      {
        title: 'User',
        dataIndex: 'userInfo',
        key: 'user',
        sorter: true,
        render(data, record) {
          return (
            <div>
              {record.userInfo && record.userInfo && record.userInfo.username}
              {/* <br />
              {record.userInfo && record.userInfo && record.userInfo.email} */}
            </div>
          );
        }
      },
      {
        title: 'Gross price',
        dataIndex: 'grossPrice',
        sorter: true,
        render(data, record) {
          return (
            <span>
              $
              {(record.grossPrice && record.grossPrice.toFixed(2)) || 0}
            </span>
          );
        }
      },
      {
        title: 'Net price',
        dataIndex: 'netPrice',
        sorter: true,
        render(data, record) {
          return (
            <span>
              $
              {(record.netPrice && record.netPrice.toFixed(2)) || 0}
            </span>
          );
        }
      },
      {
        title: 'Commission',
        dataIndex: 'commission',
        sorter: true,
        render(data, record) {
          return (
            <span>
              {record.commission * 100}
              %
            </span>
          );
        }
      },
      {
        title: 'Type',
        dataIndex: 'sourceType',
        sorter: true,
        render(sourceType: string) {
          switch (sourceType) {
            case 'performer':
              return <Tag color="blue">Subscription</Tag>;
            case 'product':
              return <Tag color="green">Store</Tag>;
            case 'video':
              return <Tag color="red">VOD</Tag>;
            default: return <Tag color="red">Performer</Tag>;
          }
        }
      },
      {
        title: 'Paid status',
        dataIndex: 'isPaid',
        render(isPaid: boolean) {
          switch (isPaid) {
            case true:
              return <Tag color="green">Paid</Tag>;
            case false:
              return <Tag color="red">Unpaid</Tag>;
            default:
              return <Tag color="red">{isPaid}</Tag>;
          }
        }
      },
      {
        title: 'Paid at',
        dataIndex: 'paidAt',
        sorter: true,
        render(paidAt: Date) {
          return <span>{formatDate(paidAt)}</span>;
        }
      },
      {
        title: 'Date',
        dataIndex: 'createdAt',
        sorter: true,
        render(createdAt: Date) {
          return <span>{formatDate(createdAt)}</span>;
        }
      },
      {
        title: 'Action',
        dataIndex: '_id',
        fixed: 'right' as 'right',
        render: (id: string) => (
          <DropdownAction
            menuOptions={[
              {
                key: 'view',
                name: 'View',
                children: (
                  <Link
                    href={{
                      pathname: '/earning/view',
                      query: { id }
                    }}
                    as={`/earning/view?id=${id}`}
                  >
                    <a>
                      <EyeOutlined />
                      {' '}
                      Details
                    </a>
                  </Link>
                )
              }
            ]}
          />
        )
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
