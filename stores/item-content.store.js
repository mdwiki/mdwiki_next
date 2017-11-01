import React from 'react';
import Router from 'next/router';
import { action, observable } from 'mobx';
import { markdown } from 'markdown';
import cheerio from 'cheerio';
import HtmlToReact from 'html-to-react';
import github from './../services/github.service.js';

export default class ItemContentStore {
  @observable isBusy = false;
  @observable path = null;
  @observable markdownText = null;
  @observable markdownAsReact = null;

  @action async changeContent(user, repository, itemName) {
    this.isBusy = true;

    try {
      this.itemName = itemName;
      this.markdownText = await github.fetchItemContent(user, repository, itemName);
      const markdownAsHtml = this.fixLinks(markdown.toHTML(this.markdownText));
      this.markdownAsReact = this.renderToReact(markdownAsHtml);
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

  renderToReact(html) {
    const processNodeDefinitions = new HtmlToReact.ProcessNodeDefinitions(React);
    const processingInstructions = [{
      shouldProcessNode: node => node.attribs && node.attribs.href && node.attribs.href.startsWith('/'),
      processNode: (node, children, index) => {
        const href = node.attribs.href.substr(1);
        const buttonElement = React.createElement(
          'button',
          { className: 'Link-button', onClick: () => { Router.push({ pathname: '/', query: { name: href } }); } },
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

