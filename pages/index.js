import React from 'react';
import { observer } from 'mobx-react';
import { initAppStore } from './../stores/app.store.js';
import PageLayout from './../components/page-layout.js';
import ItemContent from './../components/item-content.js';

@observer export default class IndexPage extends React.Component {
  static async getInitialProps({ req, query }) {
    const isServer = !!req;
    const userAgent = isServer ? req.headers['user-agent'] : window.navigator.userAgent;

    return {
      userAgent,
      itemName: query.name
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

    let itemName = this.props.itemName || 'index.md';
    if (!itemName.endsWith('.md')) {
      itemName += '.md';
    }

    return (
      <PageLayout
        userAgent={this.props.userAgent}
        appStore={this.appStore}>
        <ItemContent appStore={this.appStore} itemName={itemName} />
      </PageLayout>
    );
  }
}
