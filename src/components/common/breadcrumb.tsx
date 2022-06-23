import { PureComponent } from 'react';
import { Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import Link from 'next/link';

interface IBreadcrum {
  title: string;
  href?: string;
}

interface IProps {
  breadcrumbs: IBreadcrum[];
}

export class BreadcrumbComponent extends PureComponent<IProps> {
  render() {
    const { breadcrumbs } = this.props;
    return (
      <div style={{ marginBottom: '16px' }}>
        <Breadcrumb>
          <Breadcrumb.Item href="/" key="home_ico">
            <HomeOutlined />
          </Breadcrumb.Item>
          {breadcrumbs
            && breadcrumbs.length > 0
            && breadcrumbs.map((b) => (
              <Breadcrumb.Item key={b.title + Math.floor(Math.random() * 1000)}>
                {b.href ? (
                  <Link href={b.href}>
                    <a>{b.title}</a>
                  </Link>
                ) : (
                  b.title
                )}
              </Breadcrumb.Item>
            ))}
        </Breadcrumb>
      </div>
    );
  }
}
