import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
        />
        <link
          rel="apple-touch-icon"
          sizes="128x128"
          href="favicon.png"
        />
        <link rel="shortcut icon" href="/favicon.png" />

      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
