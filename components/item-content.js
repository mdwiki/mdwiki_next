import React from 'react';
import PropTypes from 'prop-types';
import { reaction } from 'mobx';
import { observer } from 'mobx-react';
import ItemContentStore from './../stores/item-content.store.js';
import ProgressBar from './progress-bar.js';
import ItemContentToolbar from './item-content-toolbar.js';

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
    if (!this.itemContentStore.itemContentStore) {
      this.changeItemContent(this.props.itemName);
    }

    this.unregisterReaction = reaction(
      () => this.props.appStore.selectedItem,
      itemName => this.changeItemContent(itemName)
    );
  }

  componentWillUnmount() {
    if (this.unregisterReaction) {
      this.unregisterReaction();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.itemName !== this.props.itemName) {
      this.changeItemContent(nextProps.itemName);
    }
  }

  updateLocation(itemPath) {
    if (window) {
      const location = window.location;
      const newUrl = `${location.origin}/${itemPath}`;
      if (newUrl !== location.href) {
        window.history.replaceState({}, 'PageChange', newUrl);
      }
      window.ITEM_CONTENT_STORE = this.itemContentStore;
    }
  }

  async changeItemContent(itemPath) {
    const settings = this.props.appStore.settings;
    await this.itemContentStore.changeContent(settings.user, settings.repository, itemPath);
    this.updateLocation(itemPath.substr(0, itemPath.length - 3));
  }

  async onCreateNewItem(itemName) {
    const { settings } = this.props.appStore;
    const newItem = await this.itemContentStore.createNewItem(
      settings.user,
      settings.repository,
      itemName
    );

    await this.changeItemContent(newItem.path);
    this.props.appStore.addItem(this.itemContentStore.item);
  }

  async onDeleteCurrentItem() {
    this.props.appStore.removeItem(this.itemContentStore.item.path);

    const { settings } = this.props.appStore;
    await this.itemContentStore.deleteItem(settings.user, settings.repository);

    await this.changeItemContent('index.md');
  }

  render() {
    return (
      <div className="markdown-body">
        {this.itemContentStore.isBusy && <ProgressBar />}
        {
          this.props.appStore.isLoggedIn() &&
          <ItemContentToolbar
            isInEditMode={this.itemContentStore.isInEditMode}
            deleteCurrentItem={() => this.onDeleteCurrentItem()}
            createNewItem={itemName => this.onCreateNewItem(itemName)}
          />
        }
        {this.itemContentStore.markdownAsReact}
        <style jsx> {`
          .markdown-body {
            margin-top: -70px;
          }
        `}
        </style>
      </div>
    );
  }
}

