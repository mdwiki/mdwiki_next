import React from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import github from './../services/github.service.js';

@observer export default class ItemList extends React.Component {
  static propTypes = {
    store: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.fetchItems(this.props.store);
  }

  @action async fetchItems(store) {
    const items = await github.fetchItems(store.settings.user, store.settings.repository, store.settings.oauthToken);
    store.items = items;
  }

  renderItem(item) {
    return (
      <div key={item.path}>{item.name}</div>
    );
  }

  render() {
    const store = this.props.store;
    if (!store.items) {
      return (
        <div>Items will be loaded...</div>
      );
    }

    return (
      <div>
        {store.items.map(item => this.renderItem(item))}
      </div>
    );
  }
}
