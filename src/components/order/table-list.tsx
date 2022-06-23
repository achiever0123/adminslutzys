import { Table, Tag } from 'antd';
import {
  EyeOutlined
} from '@ant-design/icons';
import { IOrder } from 'src/interfaces';
import { formatDate } from '@lib/date';
import Link from 'next/link';

interface IProps {
  dataSource: IOrder[];
  pagination: {};
  rowKey: string;
  loading: boolean;
  onChange: Function;
}

const OrderTableList = ({
  dataSource,
  pagination,
  rowKey,
  loading,
  onChange
}: IProps) => {
  const columns = [
    {
      title: 'Order number',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      sorter: true
    },
    {
      title: 'Buyer',
      key: 'buyerId',
      render(record) {
        return (
          <span>
            {`${record.buyer?.name || record.buyer?.username || 'N/A'}`}
          </span>
        );
      }
    },
    {
      title: 'Seller',
      key: 'sellerId',
      render(record) {
        return (
          <span>
            {`${record.seller?.name || record.seller?.username || 'N/A'}`}
          </span>
        );
      }
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Product type',
      dataIndex: 'productType',
      key: 'productType',
      render(productType) {
        switch (productType) {
          case 'yearly_subscription':
            return <Tag color="orange">Yearly Subscription</Tag>;
          case 'monthly_subscription':
            return <Tag color="orange">Monthly Subscription</Tag>;
          case 'sale_video':
            return <Tag color="red">Video</Tag>;
          case 'physical':
            return <Tag color="blue">Physical Product</Tag>;
          case 'digital':
            return <Tag color="blue">Digital Product</Tag>;
          default: return <Tag color="blue">{productType}</Tag>;
        }
      }
    },
    {
      title: 'Total Price',
      dataIndex: 'totalPrice',
      render(totalPrice) {
        return (
          <span>
            $
            {totalPrice.toFixed(2)}
          </span>
        );
      }
    },
    {
      title: 'Delivery Status',
      dataIndex: 'deliveryStatus',
      render(status: string) {
        switch (status) {
          case 'processing':
            return <Tag color="default">Processing</Tag>;
          case 'shipping':
            return <Tag color="warning">Shipping</Tag>;
          case 'delivered':
            return <Tag color="success">Delivered</Tag>;
          case 'refunded':
            return <Tag color="danger">Refunded</Tag>;
          default: return <Tag>{status}</Tag>;
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
      title: '#',
      dataIndex: '_id',
      render(id: string) {
        return <Link href={{ pathname: '/order/detail', query: { id } }}><a><EyeOutlined /></a></Link>;
      }
    }
  ];
  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      pagination={pagination}
      rowKey={rowKey}
      loading={loading}
      onChange={onChange.bind(this)}
    />
  );
};
export default OrderTableList;
