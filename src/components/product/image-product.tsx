import { PureComponent } from 'react';
import { IProduct } from 'src/interfaces';

interface IProps {
  product?: IProduct;
  style?: Record<string, string>;
}

export class ImageProduct extends PureComponent<IProps> {
  render() {
    const { product, style } = this.props;
    const { images } = product;
    const url = (images[0]?.thumbnails && images[0]?.thumbnails[0]) || images[0]?.url || '/product.png';
    return <img src={url} style={style || { width: 50 }} alt="url" />;
  }
}
