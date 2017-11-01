import React from 'react';
import { observer } from 'mobx-react';
import { initAppStore } from './../stores/app.store.js';
import PageLayout from './../components/page-layout.js';
import ItemContent from './../components/item-content.js';

@observer export default class IndexPage extends React.Component {
  static async getInitialProps({ query }) {
    return {
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
      <PageLayout appStore={this.appStore}>
        <ItemContent appStore={this.appStore} itemName={itemName} />
      </PageLayout>
    );
  }
}
