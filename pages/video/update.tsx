import Head from 'next/head';
import { PureComponent } from 'react';
import Page from '@components/common/layout/page';
import { Layout, message } from 'antd';
import { videoService } from '@services/video.service';
import { IVideo } from 'src/interfaces';
import Loader from '@components/common/base/loader';
import { BreadcrumbComponent } from '@components/common';
import { FormUploadVideo } from '@components/video/form-upload-video';
import Router from 'next/router';
import moment from 'moment';

interface IProps {
  id: string;
}

interface IFiles {
  fieldname: string;
  file: File;
}

class VideoUpdate extends PureComponent<IProps> {
  static async getInitialProps({ ctx }) {
    return ctx.query;
  }

  state = {
    fetching: true,
    uploading: false,
    uploadPercentage: 0,
    video: {} as IVideo
  };

  _files: {
    thumbnail: File;
    video: File;
    teaser: File;
  } = {
    thumbnail: null,
    video: null,
    teaser: null
  };

  async componentDidMount() {
    const { id } = this.props;
    try {
      const resp = await videoService.findById(id);
      this.setState({ video: resp.data });
    } catch (e) {
      message.error('Video not found!');
    } finally {
      this.setState({ fetching: false });
    }
  }

  onUploading(resp: any) {
    this.setState({ uploadPercentage: resp.percentage });
  }

  beforeUpload(file: File, field: string) {
    this._files[field] = file;
  }

  async submit(payload: IVideo) {
    const data = { ...payload };
    if ((data.isSaleVideo && !data.price) || (data.isSaleVideo && data.price < 1)) {
      message.error('Invalid price');
      return;
    }
    if ((data.isSchedule && !data.scheduledAt) || (data.isSchedule && moment(data.scheduledAt).isBefore(moment()))) {
      message.error('Invalid schedule date');
      return;
    }
    if (!data.tags || !data.tags.length) delete data.tags;
    if (!data.categoryIds || !data.categoryIds.length) delete data.categoryIds;
    if (!data.participantIds || !data.participantIds.length) delete data.participantIds;
    const files = Object.keys(this._files).reduce((f, key) => {
      if (this._files[key]) {
        f.push({
          fieldname: key,
          file: this._files[key] || null
        });
      }
      return f;
    }, [] as IFiles[]) as [IFiles];

    await this.setState({
      uploading: true
    });
    const { video } = this.state;
    try {
      await videoService.update(video._id, files, data, this.onUploading.bind(this));
      message.success('Video has been uploaded');
      // TODO - process for response data?
      Router.push('/video');
    } catch (error) {
      message.error('An error occurred, please try again!');
      this.setState({ uploading: false });
    }
  }

  render() {
    const {
      video, uploading, fetching, uploadPercentage
    } = this.state;
    return (
      <Layout>
        <Head>
          <title>Edit Video</title>
        </Head>
        <BreadcrumbComponent
          breadcrumbs={[{ title: 'Video', href: '/video' }, { title: 'Edit video' }]}
        />
        <Page>
          {fetching ? (
            <Loader />
          ) : (
            <FormUploadVideo video={video} submit={this.submit.bind(this)} uploading={uploading} beforeUpload={this.beforeUpload.bind(this)} uploadPercentage={uploadPercentage} />
          )}
        </Page>
      </Layout>
    );
  }
}

export default VideoUpdate;
