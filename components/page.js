import React from 'react';
import PropTypes from 'prop-types';
import { reaction } from 'mobx';
import { observer } from 'mobx-react';
import SimpleMDE from 'react-simplemde-editor';
import PageStore from './../stores/page.store.js';
import ProgressBar from './progress-bar.js';
import PageToolbar from './page-toolbar.js';

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

  updateLocation(path) {
    if (window) {
      const location = window.location;
      const newUrl = `${location.origin}/${path}`;
      if (newUrl !== location.href) {
        window.history.replaceState({}, 'PageChange', newUrl);
      }
    }
  }

  async loadPage(path) {
    const settings = this.props.appStore.settings;
    await this.pageStore.loadPage(settings.user, settings.repository, path);
    this.updateLocation(path.substr(0, path.length - 3));
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

  onBeforeSavePage() {
    let defaultCommitMessage;

    if (this.simpleMDE) {
      defaultCommitMessage = this.simpleMDE.simplemde.codemirror.getSelection();
    }

    if (!defaultCommitMessage) {
      defaultCommitMessage = `Some changes for ${this.pageStore.page.name}`;
    }

    return defaultCommitMessage;
  }

  async onDeletePage() {
    this.props.appStore.removePage(this.pageStore.page.path);

    const { settings } = this.props.appStore;
    await this.pageStore.deletePage(settings.user, settings.repository);

    await this.loadPage('index.md');
  }

  renderEditor() {
    if (!this.pageStore.isInEditMode) {
      return null;
    }

    return (
      <SimpleMDE
        ref={simpleMDE => this.simpleMDE = simpleMDE} // eslint-disable-line no-return-assign
        onChange={markdownText => this.pageStore.updatePage(markdownText)}
        value={this.pageStore.markdownText}
        options={SimpleMDEOptions}
      >
        <style jsx> {`
          :global(.CodeMirror-scroll) {
            height: calc(100vh - 160px);
          }
        `}
        </style>
      </SimpleMDE>
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

  renderToolbar() {
    if (!this.props.appStore.isLoggedIn()) {
      return null;
    }

    return (
      <PageToolbar
        pageStore={this.pageStore}
        onDeletePage={() => this.onDeletePage()}
        onCreatePage={pageName => this.onCreatePage(pageName)}
        onBeforeSavePage={() => this.onBeforeSavePage()}
        onSavePage={commitMessage => this.onSavePage(commitMessage)}
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

