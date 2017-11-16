import React from 'react';
import PropTypes from 'prop-types';
import { reaction } from 'mobx';
import { observer } from 'mobx-react';
import SimpleMDE from 'react-simplemde-editor';
import ItemContentStore from './../stores/item-content.store.js';
import ProgressBar from './progress-bar.js';
import ItemContentToolbar from './item-content-toolbar.js';

const SimpleMDEOptions = {
  spellChecker: false,
  status: false,
  previewRender: false,
  autofocus: true,
  toolbar: [
    'bold',
    'italic',
    'strikethrough',
    'heading',
    '|',
    'horizontal-rule',
    'quote',
    'unordered-list',
    'ordered-list',
    '|',
    'link',
    'image',
    'code',
    '|',
    'preview',
    'guide'
  ]
};

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

  async onSaveCurrentItem(commitMessage) {
    const { settings } = this.props.appStore;
    await this.itemContentStore.saveContent(
      settings.user,
      settings.repository,
      commitMessage
    );

    this.itemContentStore.toggleEditMode();

    await this.itemContentStore.changeContent(
      settings.user,
      settings.repository,
      this.itemContentStore.item.path
    );
  }

  onBeforeSaveItem() {
    let defaultCommitMessage;

    if (this.simpleMDE) {
      defaultCommitMessage = this.simpleMDE.simplemde.codemirror.getSelection();
    }

    if (!defaultCommitMessage) {
      defaultCommitMessage = `Some changes for ${this.itemContentStore.item.name}`;
    }

    return defaultCommitMessage;
  }

  async onDeleteCurrentItem() {
    this.props.appStore.removeItem(this.itemContentStore.item.path);

    const { settings } = this.props.appStore;
    await this.itemContentStore.deleteItem(settings.user, settings.repository);

    await this.changeItemContent('index.md');
  }

  renderEditor() {
    if (!this.itemContentStore.isInEditMode) {
      return null;
    }

    return (
      <SimpleMDE
        ref={simpleMDE => this.simpleMDE = simpleMDE} // eslint-disable-line no-return-assign
        onChange={markdownText => this.itemContentStore.updateContent(markdownText)}
        value={this.itemContentStore.markdownText}
        options={SimpleMDEOptions}
      />
    );
  }

  renderItemContent() {
    if (this.itemContentStore.isInEditMode) {
      return null;
    }

    return (
      <div className="Markdown-container markdown-body">
        { this.itemContentStore.markdownAsReact }
        <style jsx> {`
          .Markdown-container {
            overflow-y: auto;
            height: 100vh;
          }
        `}
        </style>
      </div>
    );
  }

  renderToolbar() {
    if (!this.props.appStore.isLoggedIn()) {
      return null;
    }

    return (
      <ItemContentToolbar
        itemContentStore={this.itemContentStore}
        deleteItem={() => this.onDeleteCurrentItem()}
        createItem={itemName => this.onCreateNewItem(itemName)}
        beforeSaveItem={() => this.onBeforeSaveItem()}
        saveItem={commitMessage => this.onSaveCurrentItem(commitMessage)}
      />
    );
  }

  render() {
    return (
      <div className="ItemContent-container">
        {this.itemContentStore.isBusy && <ProgressBar />}

        <div>
          {this.renderToolbar()}
        </div>

        {this.renderItemContent()}
        {this.renderEditor()}

        <style jsx> {`
          :global(.ItemContent-container) {
            height: calc(100vh - 84px);
            overflow-y: hidden;
          }
        `}
        </style>
      </div>
    );
  }
}

