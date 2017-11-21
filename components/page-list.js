import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import List, { ListItem, ListItemText, ListSubheader } from 'material-ui/List';
import github from './../services/github.service.js';
import groupPages from './../common/helpers/page-grouper.js';
import pageListFilter from './../common/helpers/page-list-filter.js';

@observer export default class PageList extends React.Component {
  static propTypes = {
    appStore: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.fetchPages(this.props.appStore);
  }

  componentWillReceiveProps(nextProps) {
    this.fetchPages(nextProps.appStore);
  }

  async fetchPages(appStore) {
    if (appStore.settings && appStore.settings.user) {
      const pages = await github.fetchPages(
        appStore.settings.user,
        appStore.settings.repository
      );

      appStore.setPages(pages.filter(pageListFilter));
    }
  }

  onPageClicked(page) {
    this.props.appStore.changeSelectedPage(page.name);
  }

  renderPage(page) {
    return (
      <ListItem button key={page.name}>
        <ListItemText
          className="PageNameText"
          primary={page.name.substr(0, page.name.length - 3)}
          onClick={() => this.onPageClicked(page)}
        />
      </ListItem>
    );
  }

  renderGroup(group) {
    return (
      <div key={group.letter}>
        <ListSubheader className="PageSubHeader" key={group.letter}>{group.letter}</ListSubheader>
        { group.pages.map(page => this.renderPage(page))}
      </div>
    );
  }

  render() {
    const appStore = this.props.appStore;
    if (!appStore.pages) {
      return null;
    }

    const groups = groupPages(appStore.pages);

    return (
      <List>
        {groups.map(group => this.renderGroup(group))}
        <style jsx> {`
          :global(.PageNameText) {
            margin-left: 10px;
          }

          :global(.PageSubHeader) {
            font-weight: bold;
            font-size: 18px;
          }
        `}
        </style>
      </List>
    );
  }
}
