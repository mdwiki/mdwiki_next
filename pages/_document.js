import React from 'react';
import NextDocument, { Head, Main, NextScript } from 'next/document';

export default class Document extends NextDocument {
  render() {
    return (
      <html lang="en">
        <Head>
          <title>MDWiki</title>
          <meta charSet="utf-8" />
          <meta name="viewport" content="initial-scale=1.0, width=device-width, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <link rel="manifest" href="static/manifest.json" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
          <link rel="stylesheet" href="static/styles/simplemde.min.css" />
          <link rel="stylesheet" href="static/styles/markdown.css" />
          <link rel="stylesheet" href="static/styles/styles.css" />
          <link rel="shortcut icon" href="static/images/favicon.ico" type="image/x-icon" />
          <link rel="apple-touch-icon" href="static/images/wiki.png" />
          <link rel="dns-prefetch" href="//www.janbaer.de" />
          <script src="static/scripts/register-service-worker.js" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
