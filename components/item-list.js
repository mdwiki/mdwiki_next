import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import List, { ListItem, ListItemText, ListSubheader } from 'material-ui/List';
import github from './../services/github.service.js';
import groupPages from './../common/helpers/page-grouper.js';
import pageListFilter from './../common/helpers/page-list-filter.js';

@observer export default class ItemList extends React.Component {
  static propTypes = {
    appStore: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.fetchItems(this.props.appStore);
  }

  componentWillReceiveProps(nextProps) {
    this.fetchItems(nextProps.appStore);
  }

  async fetchItems(appStore) {
    if (appStore.settings && appStore.settings.user) {
      const items = await github.fetchItems(
        appStore.settings.user,
        appStore.settings.repository
      );

      appStore.setItems(items.filter(pageListFilter));
    }
  }

  onItemClick(item) {
    this.props.appStore.changeSelectedItem(item.name);
  }

  renderPage(page) {
    return (
      <ListItem button key={page.name}>
        <ListItemText
          className="ItemNameText"
          primary={page.name.substr(0, page.name.length - 3)}
          onClick={() => this.onItemClick(page)}
        />
      </ListItem>
    );
  }

  renderGroup(group) {
    return (
      <div key={group.letter}>
        <ListSubheader className="ItemSubHeader" key={group.letter}>{group.letter}</ListSubheader>
        { group.pages.map(page => this.renderPage(page))}
      </div>
    );
  }

  render() {
    const appStore = this.props.appStore;
    if (!appStore.items) {
      return null;
    }

    const groups = groupPages(appStore.items);

    return (
      <List>
        {groups.map(group => this.renderGroup(group))}
        <style jsx> {`
          :global(.ItemNameText) {
            margin-left: 10px;
          }

          :global(.ItemSubHeader) {
            font-weight: bold;
            font-size: 18px;
          }
        `}
        </style>
      </List>
    );
  }
}
