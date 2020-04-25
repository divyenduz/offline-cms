import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class _Document extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head>{/* <link href="/static/style.css" rel="stylesheet" /> */}</Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
