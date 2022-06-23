import { PureComponent } from 'react';
import { Image } from 'antd';
import { IGallery } from 'src/interfaces';

interface IProps {
  gallery?: IGallery;
  style?: Record<string, string>;
}

export class CoverGallery extends PureComponent<IProps> {
  render() {
    const { gallery, style } = this.props;
    const { coverPhoto } = gallery;
    const url = (coverPhoto?.thumbnails && coverPhoto.thumbnails[0]) || '/gallery.png';
    return <Image preview={false} placeholder src={url} style={style || { width: 50 }} />;
  }
}
