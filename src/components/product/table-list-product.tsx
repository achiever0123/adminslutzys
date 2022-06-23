import { PureComponent } from 'react';
import {
  Table, Tag
} from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { formatDate } from '@lib/date';
import Link from 'next/link';
import { ImageProduct } from '@components/product/image-product';
import { DropdownAction } from '@components/common/dropdown-action';

interface IProps {
  dataSource: [];
  rowKey: string;
  loading: boolean;
  pagination: {};
  onChange: Function;
  deleteProduct?: Function;
}

export class TableListProduct extends PureComponent<IProps> {
  render() {
    const { deleteProduct } = this.props;
    const columns = [
      {
        title: '#',
        dataIndex: 'image',
        render(data, record) {
          return <ImageProduct product={record} />;
        }
      },
      {
        title: 'Name',
        dataIndex: 'name',
        sorter: true
      },
      {
        title: 'Model',
        dataIndex: 'performer',
        render(performer) {
          return <span>{performer?.name || performer?.username || 'N/A'}</span>;
        }
      },
      {
        title: 'Price',
        dataIndex: 'price',
        sorter: true,
        render(token: number) {
          return <span>{token}</span>;
        }
      },
      {
        title: 'Stock',
        dataIndex: 'stock',
        sorter: true,
        render(stock: number, record) {
          return <span>{record.type === 'physical' ? stock : null}</span>;
        }
      },
      {
        title: 'Type',
        dataIndex: 'type',
        render(type: string) {
          switch (type) {
            case 'physical':
              return <Tag color="orange">Physical</Tag>;
            case 'digital':
              return <Tag color="blue">Digital</Tag>;
            default: return <Tag color="default">{type}</Tag>;
          }
        }
      },
      {
        title: 'Status',
        dataIndex: 'status',
        render(status: string) {
          switch (status) {
            case 'active':
              return <Tag color="green">Active</Tag>;
            case 'inactive':
              return <Tag color="red">Inactive</Tag>;
            default: return <Tag color="default">{status}</Tag>;
          }
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
        render: (id: string) => (
          <DropdownAction
            menuOptions={[
              {
                key: 'update',
                name: 'Update',
                children: (
                  <Link
                    href={{
                      pathname: '/product/update',
                      query: { id }
                    }}
                    as={`/product/update?id=${id}`}
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
                onClick: () => deleteProduct && deleteProduct(id)
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
