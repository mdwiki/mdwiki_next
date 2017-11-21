import React from 'react';
import { observer } from 'mobx-react';
import { initAppStore } from './../stores/app.store.js';
import PageLayout from './../components/page-layout.js';
import Page from './../components/page.js';

@observer export default class IndexPage extends React.Component {
  static async getInitialProps({ query }) {
    return {
      pageName: query.name
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

    let pageName = this.props.pageName || 'index.md';
    if (!pageName.endsWith('.md')) {
      pageName += '.md';
    }

    return (
      <PageLayout appStore={this.appStore}>
        <Page appStore={this.appStore} pageName={pageName} />
      </PageLayout>
    );
  }
}
