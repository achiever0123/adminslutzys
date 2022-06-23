import {
  Table, Tag, Button
} from 'antd';
import { ISubscription } from 'src/interfaces';
import { formatDate } from '@lib/date';

interface IProps {
  dataSource: ISubscription[];
  pagination: {};
  rowKey: string;
  onChange(): Function;
  loading: boolean;
  onCancelSubscriber: Function;
}

export const TableListSubscription = ({
  dataSource,
  pagination,
  rowKey,
  onChange,
  loading,
  onCancelSubscriber
}: IProps) => {
  const columns = [
    {
      title: 'User',
      dataIndex: 'userInfo',
      render(data, records) {
        return (
          <span>
            {`${records?.userInfo?.name || records?.userInfo?.username || ''}`}
          </span>
        );
      }
    },
    {
      title: 'Model',
      dataIndex: 'performerInfo',
      render(data, records) {
        return (
          <span>
            {`${records?.performerInfo?.name || records?.performerInfo?.username || ''}`}
          </span>
        );
      }
    },
    {
      title: 'Type',
      dataIndex: 'subscriptionType',
      render(subscriptionType: string) {
        switch (subscriptionType) {
          case 'monthly':
            return <Tag color="orange">Monthly Subscription</Tag>;
          case 'yearly':
            return <Tag color="purple">Yearly Subscription</Tag>;
          case 'system':
            return <Tag color="red">System</Tag>;
          default: return <Tag color="orange">Monthly Subscription</Tag>;
        }
      }
    },
    {
      title: 'Start Date',
      dataIndex: 'startRecurringDate',
      render(data, records) {
        return <span>{records?.status === 'active' ? formatDate(records.createdAt, 'LL') : 'N/A'}</span>;
      }
    },
    {
      title: 'Renewal Date',
      dataIndex: 'nextRecurringDate',
      render(data, records) {
        return <span>{records?.status === 'active' ? formatDate(records.nextRecurringDate, 'LL') : 'N/A'}</span>;
      }
    },
    {
      title: 'Expiry Date',
      dataIndex: 'expiredAt',
      render(date: Date) {
        return <span>{formatDate(date)}</span>;
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render(status: string) {
        switch (status) {
          case 'active':
            return <Tag color="green">Active</Tag>;
          case 'deactivated':
            return <Tag color="red">Deactivated</Tag>;
          default: return <Tag color="red">Deactivated</Tag>;
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
      dataIndex: 'status',
      render(data, records) {
        return (
          <span>
            {records.status === 'active' ? (
              <Button onClick={() => onCancelSubscriber(records)} type="link">Cancel subscription</Button>
            ) : null}
          </span>
        );
      }
    }
  ];
  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      rowKey={rowKey}
      pagination={pagination}
      onChange={onChange}
      loading={loading}
    />
  );
};
