import React from 'react';
import { initStore } from './../stores/store.js';
import { observer } from 'mobx-react';
import PageLayout from './../components/page-layout.js';

@observer export default class IndexPage extends React.Component {
  static async getInitialProps({ req }) {
    const isServer = !!req;
    const userAgent = isServer ? req.headers['user-agent'] : window.navigator.userAgent;

    const store = initStore();

    return {
      isServer,
      userAgent
    };
  }

  constructor(props) {
    super(props);
    this.store = initStore(props.isServer, props.lastUpdate);
  }

  render() {
    return (
      <PageLayout
        userAgent={this.props.userAgent}
        store={this.store}>
          This is MDWiki
      </PageLayout>
    );
  }
}
