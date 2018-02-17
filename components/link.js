import React from 'react';
import PropTypes from 'prop-types';
import navigator from './../services/navigator.service.js';

export default class Link extends React.Component {
  static propTypes = {
    href: PropTypes.string.isRequired
  };

  _isExternalLink(href) {
    return href.startsWith('http');
  }

  render() {
    const { href, children } = this.props;

    if (this._isExternalLink(href)) {
      return (
        <a href={href} target="_blank" >{children}</a>
      );
    }

    const pageName = href.substr(1);

    return (
      <button
        className="Link-button"
        onClick={() => navigator.gotoPage(pageName)}
      >
        {children}
      </button>
    );
  }
}
