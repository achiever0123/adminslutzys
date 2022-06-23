import { PureComponent } from 'react';
import Page from '@components/common/layout/page';
import { BreadcrumbComponent } from '@components/common';
import ReportTableList from '@components/report/report-table-list';
import { reportService, videoService } from '@services/index';
import { message, Layout, Modal } from 'antd';
import Head from 'next/head';
import './index.less';

export default class index extends PureComponent {
  state = {
    loading: false,
    submiting: false,
    limit: 10,
    offset: 0,
    reportList: [],
    totalReport: 0,
    previewVideo: null
  }

  componentDidMount() {
    this.getData();
  }

  async handleDeleteObject(report) {
    if (report.status === 'deleted') {
      message.error('Content was deleted!');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this content')) return;
    try {
      await this.setState({ submiting: true });
      await reportService.deleteContent(report._id);
      this.setState({ submiting: false });
      this.getData();
    } catch (e) {
      const err = await e;
      message.error(err?.message || 'Error occured, please try again later');
      this.setState({ submiting: false });
    }
  }

  async handleViewObject(report) {
    if (report.status === 'deleted') {
      message.error('Content was deleted!');
      return;
    }
    try {
      await this.setState({ submiting: true });
      const resp = await videoService.findById(report.targetId);
      this.setState({ previewVideo: resp.data, submiting: false });
    } catch (e) {
      const err = await e;
      message.error(err?.message || 'Error occured, please try again later');
      this.setState({ submiting: false });
    }
  }

  async handleReject(report) {
    if (report.status !== 'reported') return;
    try {
      await this.setState({ submiting: true });
      await reportService.rejectReport(report._id);
      message.success('Rejected successfully!');
      this.setState({ submiting: false });
      this.getData();
    } catch (e) {
      const err = await e;
      this.setState({ submiting: false });
      message.error(err?.message || 'Error occured, please try again later');
    }
  }

  async handleTabChange(data) {
    await this.setState({ offset: data.current - 1 });
    this.getData();
  }

  async getData() {
    const {
      limit, offset
    } = this.state;
    try {
      await this.setState({ loading: true });
      const resp = await reportService.search({
        limit,
        offset: offset * limit
      });
      await this.setState({
        reportList: resp.data.data,
        totalReport: resp.data.total,
        loading: false
      });
    } catch (error) {
      message.error(error?.message || 'An error occured. Please try again.');
      this.setState({ loading: false });
    }
  }

  render() {
    const {
      limit, loading, submiting, reportList, totalReport, previewVideo
    } = this.state;
    return (
      <Layout>
        <Head>
          <title>Reports </title>
        </Head>
        <BreadcrumbComponent breadcrumbs={[{ title: 'Report list' }]} />
        <Page>
          <div className="report-list-table">
            <ReportTableList
              items={reportList}
              searching={loading}
              total={totalReport}
              onChange={this.handleTabChange.bind(this)}
              pageSize={limit}
              submiting={submiting}
              onDeleteObject={this.handleDeleteObject.bind(this)}
              onOpenObject={this.handleViewObject.bind(this)}
              onReject={this.handleReject.bind(this)}
            />
          </div>
          <Modal
            width={768}
            key={`video_${previewVideo?._id}`}
            title={previewVideo?.title}
            footer={null}
            onCancel={() => this.setState({ previewVideo: null })}
            visible={!!previewVideo}
            destroyOnClose
          >
            <video style={{ width: '100%', maxHeight: '400px' }} controls autoPlay>
              <source src={previewVideo?.video?.url} type="video/mp4" />
              Your browser does not support HTML video.
            </video>
          </Modal>
        </Page>
      </Layout>
    );
  }
}
