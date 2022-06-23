import Document, {
  Html, Head, Main, NextScript
} from 'next/document';
import { settingService } from '@services/setting.service';

interface IProps{
  settings: any;
}

class CustomDocument extends Document<IProps> {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    const resp = await settingService.public();
    const settings = resp.data;
    return {
      ...initialProps,
      settings
    };
  }

  render() {
    const { settings } = this.props;
    return (
      <Html>
        <Head>
          <link rel="icon" href={settings?.favicon} sizes="64x64" />
          <meta name="keywords" content={settings?.metaKeywords} />
          <meta
            name="description"
            content={settings?.metaDescription}
          />
          {/* OG tags */}
          <meta
            property="og:title"
            content={settings?.siteName}
            key="title"
          />
          <meta property="og:image" content={settings?.logoUrl} />
          <meta
            property="og:keywords"
            content={settings?.metaKeywords}
          />
          <meta
            property="og:description"
            content={settings?.metaDescription}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default CustomDocument;
