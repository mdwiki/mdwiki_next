import React from 'react';
import { action, observable } from 'mobx';
import { markdown } from 'markdown';
import cheerio from 'cheerio';
import HtmlToReact from 'html-to-react';
import github from './../services/github.service.js';
import navigator from './../services/navigator.service.js';

export default class PageStore {
  @observable isBusy = false;
  @observable path = null;
  @observable markdownText = null;
  @observable markdownAsHtml = null;
  @observable markdownAsReact = null;
  @observable isInEditMode = false;

  @action async loadPage(user, repository, path) {
    this.isBusy = true;

    try {
      this.page = await github.getPage(user, repository, path);
      this.markdownText = this.page.content;
      this.markdownAsHtml = this._fixLinks(markdown.toHTML(this.page.content));
      this.markdownAsReact = this._renderToReact(this.markdownAsHtml);
    } finally {
      this.isBusy = false;
      this.isInEditMode = false;
    }
  }

  @action async updatePage(markdownText) {
    this.markdownText = markdownText;
    this.markdownAsHtml = this._fixLinks(markdown.toHTML(this.page.content));
  }

  @action async savePage(user, repository, commitMessage) {
    this.isBusy = true;

    try {
      await github.createOrUpdatePage(
        user,
        repository,
        this.page.path,
        this.markdownText,
        commitMessage,
        this.page.sha
      );

      this.markdownText = this.page.content;
      this.markdownAsHtml = this._fixLinks(markdown.toHTML(this.page.content));
      this.markdownAsReact = this._renderToReact(this.markdownAsHtml);
    } finally {
      this.isBusy = false;
    }
  }

  @action toggleEditMode() {
    this.isInEditMode = !this.isInEditMode;
  }

  createPage(user, repository, pageName) {
    const content = `# ${pageName}`;
    const commitMessage = `Create new page ${pageName}`;
    const path = `${pageName.replace(' ', '_')}.md`.toLowerCase();

    return github.createOrUpdatePage(
      user,
      repository,
      path,
      content,
      commitMessage
    );
  }

  async deletePage(user, repository) {
    const commitMessage = `Delete page ${this.page.name}`;
    await github.deletePage(user, repository, this.page.path, commitMessage, this.page.sha);
    navigator.goHome();
  }

  _fixLinks(html) {
    const $ = cheerio.load(html);

    $('html').replaceWith(`<div>${$('body').html()}</div`);
    $('a[href^="http"]').attr('target', 'blank');

    return $.html();
  }

  _renderToReact(html) {
    const processNodeDefinitions = new HtmlToReact.ProcessNodeDefinitions(React);
    const processingInstructions = [{
      shouldProcessNode: node => node.attribs && node.attribs.href && node.attribs.href.startsWith('/'),
      processNode: (node, children, index) => {
        const href = node.attribs.href.substr(1);
        const buttonElement = React.createElement(
          'button',
          { className: 'Link-button', onClick: () => { navigator.gotoPage(href); } },
          node.children[0].data
        );
        return buttonElement;
      }
    }, {
      shouldProcessNode: () => true,
      processNode: processNodeDefinitions.processDefaultNode
    }];

    const htmlToReactParser = new HtmlToReact.Parser();
    return htmlToReactParser.parseWithInstructions(html, () => true, processingInstructions);
  }
}

