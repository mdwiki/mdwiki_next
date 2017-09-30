import React from 'react';
import { initStore } from './../stores/store.js';
import { observer } from 'mobx-react';
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
    this.store = initStore();
  }

  componentDidMount() {
    this.store = initStore();
  }

  render() {
    if (!this.store) {
      return null;
    }

    return (
      <PageLayout
        userAgent={this.props.userAgent}
        store={this.store}>
          This is MDWiki { this.store.user ? this.store.user.name : '' }
      </PageLayout>
    );
  }
}
