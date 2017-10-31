import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import List, { ListItem, ListItemText, ListSubheader } from 'material-ui/List';
import github from './../services/github.service.js';

const EXCLUDE_ITEMS = ['index.md', 'readme.md'];

@observer export default class ItemList extends React.Component {
  static propTypes = {
    appStore: PropTypes.object.isRequired
  };

  lastLetter = '';

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

      appStore.setItems(items.filter(this.itemFilter));
    }
  }

  itemFilter(item) {
    return item.name.endsWith('.md') && !EXCLUDE_ITEMS.some(itemName => itemName === item.name.toLowerCase());
  }

  onItemClick(item) {
    this.props.appStore.changeSelectedItem(item);
  }

  renderSubHeader(itemName) {
    const letter = itemName.substr(0, 1).toUpperCase();
    if (letter !== this.lastLetter) {
      this.lastLetter = letter;
      return (
        <ListSubheader className="ItemSubHeader">{letter}</ListSubheader>
      );
    }

    return null;
  }

  renderItem(item) {
    return (
      <div key={item.path}>
        { this.renderSubHeader(item.name) }
        <ListItem button={true}>
          <ListItemText className="ItemNameText"
            primary={item.name.substr(0, item.name.length -3)}
            onClick={() => this.onItemClick(item)}
          />
        </ListItem>
      </div>
    );
  }

  render() {
    const appStore = this.props.appStore;
    if (!appStore.items) {
      return null;
    }

    this.lastLetter = '';

    return (
      <List>
        {appStore.items.map(item => this.renderItem(item))}
        <style jsx> {`
          :global(.ItemNameText) {
            margin-left: 10px;
          }

          :global(.ItemSubHeader) {
            font-weight: bold;
            font-size: 18px;
          }
        `}</style>
      </List>
    );
  }
}
