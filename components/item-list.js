import React from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import github from './../services/github.service.js';

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

  @action async fetchItems(appStore) {
    if (appStore.settings && appStore.settings.user) {
      const items = await github.fetchItems(
        appStore.settings.user,
        appStore.settings.repository
      );

      appStore.items = items;
    }
  }

  renderItem(item) {
    return (
      <div key={item.path}>{item.name}</div>
    );
  }

  render() {
    const appStore = this.props.appStore;
    if (!appStore.items) {
      return null;
    }

    return (
      <div>
        {appStore.items.map(item => this.renderItem(item))}
      </div>
    );
  }
}
