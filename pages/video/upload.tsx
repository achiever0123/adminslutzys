import Head from 'next/head';
import { PureComponent } from 'react';
import { message } from 'antd';
import Page from '@components/common/layout/page';
import { videoService } from '@services/video.service';
import Router from 'next/router';
import { BreadcrumbComponent } from '@components/common';
import { FormUploadVideo } from '@components/video/form-upload-video';
import { IVideo } from 'src/interfaces';
import Layout from 'antd/lib/layout/layout';

interface IFiles {
  fieldname: string;
  file: File;
}

class UploadVideo extends PureComponent {
  state = {
    uploading: false,
    uploadPercentage: 0
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

  onUploading(resp: any) {
    this.setState({ uploadPercentage: resp.percentage });
  }

  beforeUpload(file: File, field: string) {
    this._files[field] = file;
  }

  async submit(payload: IVideo) {
    const data = { ...payload };
    if (!data.performerId) {
      message.error('Please select a model!');
      return;
    }
    if (!this._files.video) {
      message.error('Please select a video!');
      return;
    }
    if ((data.isSaleVideo && !data.price) || (data.isSaleVideo && data.price < 1)) {
      message.error('Invalid price');
      return;
    }
    if (!data.title) data.title = this._files.video.name;
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
    try {
      await videoService.uploadVideo(files as any, data, this.onUploading.bind(this));
      message.success('Video has been uploaded');
      Router.push('/video');
    } catch (error) {
      message.error('An error occurred, please try again!');
      this.setState({ uploading: false });
    }
  }

  render() {
    const { uploading, uploadPercentage } = this.state;
    return (
      <Layout>
        <Head>
          <title>Upload video</title>
        </Head>
        <BreadcrumbComponent breadcrumbs={[{ title: 'Video', href: '/video' }, { title: 'Upload video' }]} />
        <Page>
          <FormUploadVideo
            submit={this.submit.bind(this)}
            beforeUpload={this.beforeUpload.bind(this)}
            uploading={uploading}
            uploadPercentage={uploadPercentage}
          />
        </Page>
      </Layout>
    );
  }
}

export default UploadVideo;
