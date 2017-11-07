import React from 'react';
import { action, observable } from 'mobx';
import { markdown } from 'markdown';
import cheerio from 'cheerio';
import HtmlToReact from 'html-to-react';
import github from './../services/github.service.js';
import navigator from './../services/navigator.service.js';

export default class ItemContentStore {
  @observable isBusy = false;
  @observable path = null;
  @observable markdownText = null;
  @observable markdownAsHtml = null;
  @observable markdownAsReact = null;
  @observable isInEditMode = false;

  @action async changeContent(user, repository, itemName) {
    this.isBusy = true;

    try {
      this.item = await github.fetchItem(user, repository, itemName);
      this.markdownText = this.item.content;
      this.markdownAsHtml = this.fixLinks(markdown.toHTML(this.item.content));
      this.markdownAsReact = this.renderToReact(this.markdownAsHtml);
    } finally {
      this.isBusy = false;
    }
  }

  fixLinks(html) {
    const $ = cheerio.load(html);

    $('html').replaceWith(`<div>${$('body').html()}</div`);
    $('a[href^="http"]').attr('target', 'blank');

    return $.html();
  }

  createNewItem(user, repository, itemName) {
    const itemContent = `# ${itemName}`;
    const commitMessage = `Create new page ${itemName}`;
    const itemPath = `${itemName.replace(' ', '')}.md`;

    return github.putItem(
      user,
      repository,
      itemPath,
      itemContent,
      commitMessage
    );
  }

  async deleteItem(user, repository) {
    const commitMessage = `Delete page ${this.item.name}`;
    await github.deleteItem(user, repository, this.item.path, commitMessage, this.item.sha);
  }

  renderToReact(html) {
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

