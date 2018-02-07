import React from 'react';
import { observer } from 'mobx-react';
import PageLayout from './../components/page-layout.js';
import Page from './../components/page.js';
import navigator from './../services/navigator.service.js';

@observer export default class IndexPage extends React.Component {
  static async getInitialProps({ query }) {
    return {
      pageName: query.page
    };
  }

  componentDidMount() {
    const pageName = this.props.pageName || 'index';
    navigator.gotoPage(pageName);
  }

  render() {
    return (
      <PageLayout>
        <Page />
      </PageLayout>
    );
  }
}
