import { PureComponent } from 'react';
import { Image } from 'antd';
import { IPhotoUpdate } from 'src/interfaces';

interface IProps {
  photo?: IPhotoUpdate;
  style?: Record<string, string>;
}

export class ThumbnailPhoto extends PureComponent<IProps> {
  render() {
    const { style, photo } = this.props;
    const { photo: item } = photo;
    const urlThumb = (item?.thumbnails && item?.thumbnails[0]) || '/placeholder-img.jpg';
    return <Image preview={false} src={urlThumb} style={style || { width: 50 }} />;
  }
}
