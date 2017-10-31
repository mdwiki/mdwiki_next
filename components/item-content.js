import React from 'react';
import PropTypes from 'prop-types';
import { reaction } from 'mobx';
import { observer } from 'mobx-react';
import github from './../services/github.service.js';
import ItemContentStore from './../stores/item-content.store.js';

@observer export default class ItemContent extends React.Component {
  static propTypes = {
    appStore: PropTypes.object.isRequired,
    itemName: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
    this.itemContentStore = new ItemContentStore();
  }

  componentDidMount() {
    if (!this.itemContentStore.path) {
      this.changeItemContent(this.props.itemName);
    }

    const changeReaction = reaction(
      () => this.props.appStore.selectedItem,
      item => this.changeItemContent(item.path)
    );
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.itemName != this.props.itemName) {
      this.changeItemContent(nextProps.itemName);
    }
  }

  updateLocation(pathname) {
    if (window) {
      const location = window.location;
      const newUrl = `${location.origin}/${pathname}`;
      if (newUrl !== location.href) {
        window.history.replaceState({}, 'PageChange', newUrl);
      }
      window.ITEM_CONTENT_STORE = this.itemContentStore;
    }
  }

  changeItemContent(path) {
    const settings = this.props.appStore.settings;
    this.itemContentStore.changeContent(settings.user, settings.repository, path);
    this.updateLocation(path.substr(0, path.length -3));
  }

  render() {
    return (
      <div className="markdown-body">
        {this.itemContentStore.markdownAsReact}
      </div>
    );
  }
}

