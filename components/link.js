import React from 'react';
import PropTypes from 'prop-types';
import navigator from './../services/navigator.service.js';

export default class Link extends React.Component {
  static propTypes = {
    href: PropTypes.string.isRequired
  };

  _isExternalLink(href) {
    if (href) {
      return href.startsWith('http');
    }
    return true;
  }

  render() {
    const { href, children } = this.props;

    if (this._isExternalLink(href)) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
      );
    }

    const pageName = href.substr(1);

    return (
      <button
        type="button"
        className="Link-button"
        onClick={() => navigator.gotoPage(pageName)}
      >
        {children}
      </button>
    );
  }
}
