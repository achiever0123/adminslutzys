import { PureComponent } from 'react';
import { IAppConfig } from 'src/interfaces';
import PrimaryLayout from './primary-layout';
import PublicLayout from './public-layout';

interface DefaultProps {
  children: any;
  appConfig?: IAppConfig;
  layout?: string;
}

const LayoutMap = {
  primary: PrimaryLayout,
  public: PublicLayout
};

export default class BaseLayout extends PureComponent<DefaultProps> {
  render() {
    const { children, layout } = this.props;
    const Container = layout && LayoutMap[layout] ? LayoutMap[layout] : LayoutMap.primary;
    return (
      <Container>{children}</Container>
    );
  }
}
