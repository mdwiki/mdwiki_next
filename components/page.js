import React from 'react';
import PropTypes from 'prop-types';
import { reaction } from 'mobx';
import { observer } from 'mobx-react';
import HotKey from 'react-shortcut';
import MarkdownEditor from './markdown-editor.js';
import PageStore from './../stores/page.store.js';
import ProgressBar from './progress-bar.js';
import PageToolbar from './page-toolbar.js';

@observer export default class Page extends React.Component {
  static propTypes = {
    appStore: PropTypes.object.isRequired,
    pageName: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
    this.pageStore = new PageStore();
  }

  async componentDidMount() {
    if (this.props.pageName) {
      await this.loadPage(this.props.pageName);

      this.unregisterReaction = reaction(
        () => this.props.appStore.selectedPage,
        pageName => this.loadPage(pageName)
      );
    }
  }

  componentWillUnmount() {
    if (this.unregisterReaction) {
      this.unregisterReaction();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.pageName !== this.props.pageName) {
      this.loadPage(nextProps.pageName);
    }
  }

  async loadPage(path) {
    const settings = this.props.appStore.settings;
    await this.pageStore.loadPage(settings.user, settings.repository, path);
  }

  async onCreatePage(pageName) {
    const { settings } = this.props.appStore;
    const newPage = await this.pageStore.createPage(
      settings.user,
      settings.repository,
      pageName
    );

    await this.loadPage(newPage.path);
    this.props.appStore.addPage(this.pageStore.page);

    this.pageStore.toggleEditMode();
  }

  async onSavePage(commitMessage) {
    const { settings } = this.props.appStore;
    await this.pageStore.savePage(
      settings.user,
      settings.repository,
      commitMessage
    );

    this.pageStore.toggleEditMode();

    await this.pageStore.loadPage(
      settings.user,
      settings.repository,
      this.pageStore.page.path
    );
  }

  async onDeletePage() {
    this.props.appStore.removePage(this.pageStore.page.path);

    const { settings } = this.props.appStore;
    await this.pageStore.deletePage(settings.user, settings.repository);

    await this.loadPage('index');
  }

  renderEditor() {
    if (!this.pageStore.isInEditMode) {
      return null;
    }

    return (
      <MarkdownEditor
        pageStore={this.pageStore}
        onSavePage={commitMessage => this.onSavePage(commitMessage)}
      />
    );
  }

  renderPage() {
    if (this.pageStore.isInEditMode) {
      return null;
    }

    return (
      <div className="Markdown-container markdown-body">
        { this.pageStore.markdownAsReact }
        <style jsx> {`
          .Markdown-container {
            overflow-y: auto;
            height: calc(100vh - 90px);
          }
        `}
        </style>
      </div>
    );
  }

  onEditHotKeyPressed() {
    if (!this.pageStore.isInEditMode) {
      this.pageStore.toggleEditMode();
    }
  }

  renderToolbar() {
    if (!this.props.appStore.isLoggedIn()) {
      return null;
    }

    return (
      <PageToolbar
        pageStore={this.pageStore}
        onDeletePage={() => this.onDeletePage()}
        onCreatePage={pageName => this.onCreatePage(pageName)}
      />
    );
  }

  render() {
    return (
      <div className="Page-container">
        {this.pageStore.isBusy && <ProgressBar />}

        <div>
          {this.renderToolbar()}
        </div>

        {this.renderPage()}
        {this.renderEditor()}

        <HotKey
          keys={['shift', 'e']}
          simultaneous
          onKeysCoincide={() => this.onEditHotKeyPressed()}
        />

        <style jsx> {`
          .Page-container {
            height: calc(100vh - 84px);
            overflow-y: hidden;
          }
        `}
        </style>
      </div>
    );
  }
}

