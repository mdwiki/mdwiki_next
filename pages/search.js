import React from 'react';
import { reaction } from 'mobx';
import { observer } from 'mobx-react';
import Router from 'next/router';
import { initAppStore } from './../stores/app.store.js';
import SearchStore from './../stores/search.store.js';
import PageLayout from './../components/page-layout.js';

const DELAY_TYPE_TIMEOUT = 1000;

@observer export default class SearchPage extends React.Component {
  static getInitialProps({ req, query }) {
    const isServer = !!req;
    const userAgent = isServer ? req.headers['user-agent'] : window.navigator.userAgent;

    return {
      userAgent,
      searchTerm: query.searchTerm
    };
  }

  constructor(props) {
    super(props);
    this.appStore = initAppStore();
    this.searchStore = new SearchStore();
  }

  async componentDidMount() {
    this.appStore = initAppStore();
    if (this.props.searchTerm) {
      this.appStore.searchTerm = this.props.searchTerm;
    }

    this.searchStore = new SearchStore();
    if (this.appStore.searchTerm) {
      await this.startSearch(this.appStore.searchTerm);
      this.forceUpdate(); // HACK - I don't know why this is necessary
    }

    if (window) {
      window.APP_STORE = this.appStore;
      window.SEARCH_STORE = this.searchStore;
    }

    reaction(
      () => this.appStore.searchTerm,
      searchTerm => this.startSearchDelayed(searchTerm)
    );
  }

  startSearchDelayed(searchTerm) {
    if (this.typeTimeout) {
      clearTimeout(this.typeTimeout);
    }

    this.typeTimeout = setTimeout(() => {
      this.startSearch(searchTerm);
    }, DELAY_TYPE_TIMEOUT);
  }

  async startSearch(searchTerm) {
    if (!searchTerm) {
      return;
    }
    const settings = this.appStore.settings;
    await this.searchStore.startSearch(settings.user, settings.repository, searchTerm);
  }

  navigateTo(itemName) {
    Router.push({ pathname: '/', query: { name: itemName }});
  }

  renderSearchResultItem(item) {
    return (
      <li key={item.name}>
        <button className="Link-button" onClick={() => this.navigateTo(item.name)}>{item.name}</button>
      </li>
    );
  }

  render() {
    if (!this.appStore || !this.searchStore) {
      return null;
    }

    const searchStore = this.searchStore;

    return (
      <PageLayout
        userAgent={this.props.userAgent}
        appStore={this.appStore}
        showSidebar={false}
      >
        <div className="markdown-body SearchPage-container">
          <h1>SearchResult</h1>
          <div className="SearchPageInput-container">
            <span className="SearchTerm-label">You searched for:</span>
            <span className="SearchTerm-value">{searchStore.searchTerm}</span>
          </div>
          <div className="SearchPageResult-container">
            <ul>
              { searchStore.searchResult && searchStore.searchResult.items.map(s => this.renderSearchResultItem(s))}
            </ul>
          </div>
        </div>

        <style jsx> {`
          .SearchPage-container {
            margin: 10px;
          }

          .SearchPageInput-container {
            margin: 10px;
          }

          .SearchTerm-label {
            font-weight: bold;
          }

          .SearchTerm-value {
            font-style: italic;
            margin-left: 10px;
          }

          .SearchPageResult-container {
            margin: 10px;
          }
        `}</style>
      </PageLayout>
    );
  }
}
