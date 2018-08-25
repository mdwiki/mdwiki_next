import React from 'react';
import { observer } from 'mobx-react';
import PageLayout from './../components/page-layout.js';
import Page from './../components/page.js';
import navigator from './../services/navigator.service.js';
import appStore from './../stores/app.store.js';

@observer export default class IndexPage extends React.Component {
  static async getInitialProps({ query }) {
    return {
      pageName: query.page
    };
  }

  componentDidMount() {
    const { pageName } = this.props;
    navigator.gotoPage(pageName || 'index');
  }

  componentWillReceiveProps(nextProps) {
    if (appStore.selectedPage !== nextProps.pageName) {
      navigator.gotoPage(nextProps.pageName);
    }
  }

  render() {
    return (
      <PageLayout>
        <Page />
      </PageLayout>
    );
  }
}
