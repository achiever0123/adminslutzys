/* eslint-disable react/destructuring-assignment */
import { Table, Tag } from 'antd';
import Link from 'next/link';
import { PayoutRequestInterface } from 'src/interfaces';
import { formatDate } from 'src/lib';

interface IProps {
  payouts: PayoutRequestInterface[];
  searching: boolean;
  total: number;
  pageSize: number;
  onChange: Function;
}

const PayoutRequestList = ({
  payouts,
  searching,
  total,
  pageSize,
  onChange
}: IProps) => {
  const columns = [
    {
      title: '#',
      dataIndex: '_id',
      key: 'id',
      render: (id: string, record) => (
        <Link
          href={{
            pathname: '/payout-requests/details',
            query: {
              id: record._id,
              performerId: record.sourceId
            }
          }}
          as={`/payout-request/details?id=${record._id}&performerId=${record.sourceId}`}
        >
          <a>
            {id.slice(16, 24).toUpperCase()}
          </a>
        </Link>
      )
    },
    {
      title: 'Performer',
      dataIndex: 'sourceInfo',
      key: 'sourceInfo',
      render: (sourceInfo: any) => (
        <span>
          {sourceInfo?.name || sourceInfo?.username || 'N/A'}
        </span>
      )
    },
    {
      title: 'Requested Price',
      dataIndex: 'requestedPrice',
      key: 'requestedPrice',
      render: (requestedPrice: number) => (
        <span>
          $
          {(requestedPrice || 0).toFixed(2)}
        </span>
      )
    },
    {
      title: 'Payout Gateway',
      dataIndex: 'paymentAccountType',
      key: 'paymentAccountType',
      render: (paymentAccountType: string) => {
        switch (paymentAccountType) {
          case 'banking':
            return <Tag color="#656fde">Banking</Tag>;
          case 'paypal':
            return <Tag color="#25397c">Paypal</Tag>;
          default:
            break;
        }
        return <Tag color="default">{paymentAccountType}</Tag>;
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        switch (status) {
          case 'done':
            return <Tag color="green" style={{ textTransform: 'capitalize' }}>Done</Tag>;
          case 'pending':
            return <Tag color="orange" style={{ textTransform: 'capitalize' }}>Pending</Tag>;
          case 'rejected':
            return <Tag color="red" style={{ textTransform: 'capitalize' }}>Rejected</Tag>;
          default: break;
        }
        return <Tag color="blue" style={{ textTransform: 'capitalize' }}>{status}</Tag>;
      }
    },
    {
      title: 'Updated on',
      key: 'updatedAt',
      dataIndex: 'updatedAt',
      render: (updatedAt: Date) => <span>{formatDate(updatedAt)}</span>,
      sorter: true
    },
    {
      title: 'Action',
      key: 'details',
      render: (record: PayoutRequestInterface) => (
        <Link
          href={{
            pathname: '/payout-requests/details',
            query: {
              id: record._id,
              performerId: record.sourceId
            }
          }}
          as={`/payout-request/details?id=${record._id}&performerId=${record.sourceId}`}
        >
          <a>View</a>
        </Link>
      )
    }
  ];
  const dataSource = payouts.map((p) => ({ ...p, key: p._id }));

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      className="table"
      pagination={{
        total,
        pageSize
      }}
      scroll={{ x: true }}
      showSorterTooltip={false}
      loading={searching}
      onChange={onChange.bind(this)}
    />
  );
};
PayoutRequestList.defaultProps = {};
export default PayoutRequestList;
