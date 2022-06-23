import { PureComponent } from 'react';
import { Table, Tag } from 'antd';
import {
  DeleteOutlined, EditOutlined
} from '@ant-design/icons';
import { formatDate } from '@lib/date';
import Link from 'next/link';
import { DropdownAction } from '@components/common/dropdown-action';
import moment from 'moment';

interface IProps {
  dataSource: [];
  rowKey: string;
  loading: boolean;
  pagination: {};
  onChange: Function;
  deleteCoupon?: Function;
}

export class TableListCoupon extends PureComponent<IProps> {
  render() {
    const { deleteCoupon } = this.props;
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name'
      },
      {
        title: 'Code',
        dataIndex: 'code',
        render(code: string) {
          return <span>{code}</span>;
        }
      },
      {
        title: 'Discount percentage',
        dataIndex: 'value',
        render(value: number) {
          return (
            <span>
              {value * 100}
              %
            </span>
          );
        }
      },
      {
        title: 'Number of Uses',
        dataIndex: 'numberOfUses',
        sorter: true,
        render(numberOfUses: number) {
          return (
            <span>
              {numberOfUses}
            </span>
          );
        }
      },
      {
        title: 'Status',
        dataIndex: 'status',
        render(status: string, record) {
          switch (status) {
            case 'active':
              return <Tag color={moment().isAfter(moment(record.expiredDate)) ? 'red' : 'success'}>{moment().isAfter(moment(record.expiredDate)) ? 'Inactive' : 'Active'}</Tag>;
            case 'inactive':
              return <Tag color="red">Inactive</Tag>;
            default:
              return <Tag color="default">{status}</Tag>;
          }
        }
      },
      {
        title: 'Expiry Date',
        dataIndex: 'expiredDate',
        sorter: true,
        render(date: Date) {
          return <span>{formatDate(date, 'YYYY-MM-DD')}</span>;
        }
      },
      {
        title: 'Updated on',
        dataIndex: 'updatedAt',
        sorter: true,
        render(date: Date) {
          return <span>{formatDate(date)}</span>;
        }
      },
      {
        title: 'Action',
        dataIndex: '_id',
        render: (data, record) => (
          <DropdownAction
            menuOptions={[
              {
                key: 'update',
                name: 'Update',
                children: (
                  <Link
                    href={{
                      pathname: '/coupon/update',
                      query: { id: record._id }
                    }}
                    as={`/coupon/update?id=${record._id}`}
                  >
                    <a>
                      <EditOutlined />
                      {' '}
                      Update
                    </a>
                  </Link>
                )
              },
              {
                key: 'delete',
                name: 'Delete',
                children: (
                  <span>
                    <DeleteOutlined />
                    {' '}
                    Delete
                  </span>
                ),
                onClick: () => deleteCoupon && deleteCoupon(record._id)
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
