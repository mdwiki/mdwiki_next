import React from 'react';
import { reaction } from 'mobx';
import { observer } from 'mobx-react';
import Markdown from 'markdown-to-jsx';
import HotKey from './hotkey.js';
import MarkdownEditor from './markdown-editor.js';
import PageStore from './../stores/page.store.js';
import ProgressBar from './progress-bar.js';
import PageToolbar from './page-toolbar.js';
import appStore from './../stores/app.store.js';
import navigator from './../services/navigator.service.js';
import Link from './link.js';

const markdownRenderOptions = {
  overrides: {
    a: {
      component: Link
    }
  }
};

@observer export default class Page extends React.Component {
  pageStore = new PageStore();

  async componentDidMount() {
    if (appStore.selectedPage) {
      await this.loadPage(appStore.selectedPage);
    }

    this.unregisterReaction = reaction(
      () => appStore.selectedPage,
      pageName => this.loadPage(pageName)
    );
  }

  componentWillUnmount() {
    if (this.unregisterReaction) {
      this.unregisterReaction();
    }
  }

  async loadPage(path) {
    const { settings } = appStore;
    await this.pageStore.loadPage(settings.user, settings.repository, path);
  }

  async onCreatePage(pageName) {
    const { settings } = appStore;
    const newPage = await this.pageStore.createPage(
      settings.user,
      settings.repository,
      pageName
    );

    await this.loadPage(newPage.path);
    appStore.addPage(this.pageStore.page);

    this.pageStore.toggleEditMode();
  }

  async onSavePage(commitMessage) {
    const { settings } = appStore;
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
    appStore.removePage(this.pageStore.page.path);

    const { settings } = appStore;

    await this.pageStore.deletePage(settings.user, settings.repository);

    navigator.goHome();
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
        <Markdown options={markdownRenderOptions}>
          { this.pageStore.markdown }
        </Markdown>
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
    if (!appStore.isLoggedIn()) {
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

