import { PureComponent } from 'react';
import { IBannerUpdate } from 'src/interfaces';

interface IProps {
  banner?: IBannerUpdate;
  style?: Record<string, string>;
}

export class ThumbnailBanner extends PureComponent<IProps> {
  render() {
    const { banner, style } = this.props;
    const { photo } = banner;
    const urlThumb = photo ? photo.url : '/camera.png';
    return <img src={urlThumb} style={style || { width: 100 }} alt="thumb" />;
  }
}
