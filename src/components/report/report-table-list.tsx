import { formatDate } from '@lib/date';
import {
  Table, Tooltip, Tag, Avatar
} from 'antd';
import { EyeOutlined, DeleteOutlined, StopOutlined } from '@ant-design/icons';
import { DropdownAction } from '@components/common/dropdown-action';

interface IProps {
  items: any[];
  total: number;
  pageSize: number;
  searching: boolean;
  submiting: boolean;
  onChange: Function;
  onDeleteObject: Function;
  onOpenObject: Function;
  onReject: Function;
}

const reportTableList = ({
  items,
  total,
  pageSize,
  searching,
  submiting,
  onChange,
  onDeleteObject,
  onOpenObject,
  onReject
}: IProps) => {
  const columns = [
    {
      title: 'Reporter',
      dataIndex: 'sourceInfo',
      key: 'sourceInfo',
      render: (user) => (
        <span>
          <Avatar src={user?.avatar || '/no-avatar.png'} />
          {' '}
          {user?.name || user?.username || 'N/A'}
        </span>
      )
    },
    // {
    //   title: 'Type',
    //   dataIndex: 'target',
    //   key: 'target',
    //   render: (target) => (
    //     <Tag color="blue" style={{ textTransform: 'capitalize' }}>{target}</Tag>
    //   )
    // },
    {
      title: 'Video',
      dataIndex: 'targetId',
      key: 'targetId',
      render: (targetId, record) => (
        <span>
          {record?.targetInfo?.title || 'N/A'}
        </span>
      )
    },
    {
      title: 'Model',
      dataIndex: 'performerInfo',
      key: 'performerInfo',
      render: (performer) => (
        <span>
          {performer?.name || performer?.username || 'N/A'}
        </span>
      )
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (description) => (
        <Tooltip title={description}>
          <div style={{
            width: 150, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden'
          }}
          >
            {description || 'N/A'}
          </div>
        </Tooltip>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render(status: string) {
        switch (status) {
          case 'reported':
            return <Tag color="green">Reported</Tag>;
          case 'rejected':
            return <Tag color="orange">Rejected</Tag>;
          case 'deleted':
            return <Tag color="red">Video Deleted</Tag>;
          default: return <Tag color="default">{status}</Tag>;
        }
      }
    },
    {
      title: 'Updated at',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (updatedAt: Date) => <span>{formatDate(updatedAt)}</span>
    },
    {
      title: 'Action',
      key: '_id',
      render: (record) => (
        <DropdownAction
          menuOptions={[
            {
              key: 'reject',
              name: 'Reject Report',
              children: (
                <span>
                  <StopOutlined />
                  {' '}
                  Reject Report
                </span>
              ),
              onClick: () => !submiting && record.status === 'reported' && onReject(record)
            },
            {
              key: 'update',
              name: 'View Content',
              children: (
                <span>
                  <EyeOutlined />
                  {' '}
                  View Content
                </span>
              ),
              onClick: () => !submiting && onOpenObject(record)
            },
            {
              key: 'delete',
              name: 'Delete Content',
              children: (
                <span>
                  <DeleteOutlined />
                  {' '}
                  Delete Content
                </span>
              ),
              onClick: () => !submiting && onDeleteObject(record)
            }
          ]}
        />
      )
    }
  ];

  const dataSource = items.map((p) => ({ ...p, key: p._id }));

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      className="table"
      pagination={{
        total,
        pageSize
      }}
      rowKey="_id"
      loading={searching}
      onChange={onChange.bind(this)}
    />
  );
};
export default reportTableList;
