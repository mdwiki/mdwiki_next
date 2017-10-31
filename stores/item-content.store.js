import React from 'react';
import Router from 'next/router';
import { action, observable } from 'mobx';
import { markdown } from 'markdown';
import cheerio from 'cheerio';
import HtmlToReact from 'html-to-react';
import { Parser as HtmlToReactParser } from 'html-to-react';
import github from './../services/github.service.js';

const keys = new Set();

export default class ItemContentStore {
  @observable path = null;
  @observable markdownText = null;
  @observable markdownAsReact = null;

  @action async changeContent(user, repository, path) {
    const markdownText = await github.fetchItemContent(user, repository, path);
    const markdownAsHtml = this.fixLinks(markdown.toHTML(markdownText));
    const markdownAsReact = this.renderToReact(markdownAsHtml);
    console.log('REact', markdownAsReact);

    this.path = path;
    this.markdownText = markdownText;
    this.markdownAsReact = markdownAsReact;
  }

  fixLinks(html) {
    const $ = cheerio.load(html);

    $('html').replaceWith(`<div>${$('body').html()}</div`);
    $('a[href^="http"]').attr('target', 'blank');

    return $.html();
  }

  isValidNode() {
    return true;
  }

  renderToReact(html) {
    const processNodeDefinitions = new HtmlToReact.ProcessNodeDefinitions(React);
    const processingInstructions = [{
      shouldProcessNode: function (node) {
        return node.attribs && node.attribs.href && node.attribs.href.startsWith('/');
      },
      processNode: function (node, children, index) {
        const href = node.attribs.href.substr(1);
        const buttonElement = React.createElement('button', { className:'link-button', onClick: () => {
          Router.push({ pathname: '/', query: { name: href } });
        }}, node.children[0].data);
        return buttonElement;
      }
    }, {
      shouldProcessNode: () => {
        return true;
      },
      processNode: processNodeDefinitions.processDefaultNode
    }];

    const htmlToReactParser = new HtmlToReactParser();
    return htmlToReactParser.parseWithInstructions(html, this.isValidNode, processingInstructions);
  }
}

