import React from 'react';
import { reaction } from 'mobx';
import { observer } from 'mobx-react';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import SearchIcon from 'material-ui-icons/Search';
import { initAppStore } from './../stores/app.store.js';
import SearchStore from './../stores/search.store.js';
import PageLayout from './../components/page-layout.js';
import ProgressBar from './../components/progress-bar.js';
import { screensizes } from './../common/styles/screensizes.js';
import navigator from './../services/navigator.service.js';

const DELAY_TYPE_TIMEOUT = 1000;

@observer export default class SearchPage extends React.Component {
  static getInitialProps({ query }) {
    return {
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

    this.unregisterReaction = reaction(
      () => this.appStore.searchTerm,
      searchTerm => this.startSearchDelayed(searchTerm)
    );
  }

  componentWillUnmount() {
    if (this.unregisterReaction) {
      this.unregisterReaction();
    }
  }

  startSearchDelayed(searchTerm) {
    if (this.typeTimeout) {
      clearTimeout(this.typeTimeout);
    }

    this.typeTimeout = setTimeout(() => {
      this.startSearch(searchTerm);
    }, DELAY_TYPE_TIMEOUT);
  }

  onSearchTermChanged(searchTerm) {
    this.appStore.searchTerm = searchTerm;
  }

  async startSearch(searchTerm) {
    if (!searchTerm) {
      return;
    }
    const settings = this.appStore.settings;
    await this.searchStore.startSearch(settings.user, settings.repository, searchTerm);
  }

  navigateTo(pageName) {
    navigator.gotoPage(pageName);
  }

  renderSearchResult(page) {
    return (
      <li key={page.name}>
        <button className="Link-button" onClick={() => this.navigateTo(page.name)}>{page.name}</button>
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
        appStore={this.appStore}
        showSidebar={false}
      >
        {searchStore.isBusy && <ProgressBar />}
        <div className="markdown-body SearchPage-container">
          <h1>Search</h1>
          <div className="SearchPageValue-container">
            <span className="SearchTerm-label">You searched for:</span>
            <span className="SearchTerm-value">{searchStore.searchTerm}</span>
          </div>
          <div className="SearchPageInput-container">
            <TextField
              id="searchTerm"
              value={this.appStore.searchTerm}
              onChange={(e) => this.onSearchTermChanged(e.target.value)}
            />
            <IconButton
              className="Search-button"
              aria-label="Search"
              onClick={() => this.startSearch(this.appStore.searchTerm)}
            >
              <SearchIcon />
            </IconButton>
          </div>
          <div className="SearchPageResult-container">
            <ul>
              {
                searchStore.searchResult &&
                searchStore.searchResult.items.map(s => this.renderSearchResult(s))
              }
            </ul>
          </div>
        </div>

        <style jsx> {`
          h1 {
            display: none;
          }

          .SearchPage-container {
            margin: 10px;
          }

          .SearchPageValue-container {
            display: none;
          }

          .SearchPageInput-container {
            display: flex;
            margin: 10px 10px 20px 10px;
          }

          .SearchTerm-label {
            font-weight: bold;
          }

          .SearchTerm-value {
            font-style: italic;
            margin-left: 10px;
          }

          :global(.Search-button) {
            height: 32px;
            width: 48px;
          
          }

          .SearchPageResult-container {
            margin: 10px;
          }

          ul {
            list-style: inherit;
          }

          @media (min-width: ${ screensizes.smallTablet }) {
            h1 {
              display: block;
            }

            .SearchPageValue-container {
              display: block;
              margin: 10px;
            }

            .SearchPageInput-container {
              display: none;
            }
          }
        `}
        </style>
      </PageLayout>
    );
  }
}
