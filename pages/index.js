import React from 'react';
import { observer } from 'mobx-react';
import { initAppStore } from './../stores/app.store.js';
import PageLayout from './../components/page-layout.js';

@observer export default class IndexPage extends React.Component {
  static async getInitialProps({ req }) {
    const isServer = !!req;
    const userAgent = isServer ? req.headers['user-agent'] : window.navigator.userAgent;

    return {
      userAgent
    };
  }

  constructor(props) {
    super(props);
    this.appStore = initAppStore();
  }

  componentDidMount() {
    this.appStore = initAppStore();
  }

  render() {
    if (!this.appStore) {
      return null;
    }

    return (
      <PageLayout
        userAgent={this.props.userAgent}
        appStore={this.appStore}>
          This is MDWiki { this.appStore.user ? this.appStore.user.name : '' }
      </PageLayout>
    );
  }
}
