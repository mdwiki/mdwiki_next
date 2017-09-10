import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Router from 'next/router';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import AccountIcon from 'material-ui-icons/AccountCircle';
import Typography from 'material-ui/Typography';
import Drawer from 'material-ui/Drawer';
import classNames from 'classnames';

import GithubIcon from './github-icon.js';
import SearchButton from './search-button.js';
import ItemList from './item-list.js';
import { screensizes } from './../common/styles/screensizes.js';

export default class PageLayout extends React.Component {
  static propTypes = {
    children: PropTypes.any.isRequired,
    userAgent: PropTypes.string.isRequired,
    store: PropTypes.object.isRequired,
    title: PropTypes.string,
    showSidebar: PropTypes.bool
  };

  static defaultProps = {
    title: 'MDWiki',
    showSidebar: true
  };


  state = {
    showLeftSidebar: false
  };

  logout() {
    //authService.logout();
  }

  toggleLeftSidebar() {
    const showLeftSidebar = this.state.showLeftSidebar;
    this.setState({ showLeftSidebar: !showLeftSidebar });
  }

  connect(store) {
    Router.push({
      pathname: '/connect',
      query: { user: store.settings.user, repository: store.settings.repository }
    });
  }

  login() {
  }

  renderStaticSidebar(store) {
    return (
      <div className="Sidebar">
        <ItemList store={store} />
      </div>
    );
  }

  renderMobileSidebar(store) {
    return (
      <Drawer className="LeftSidebar"
        type="temporary"
        anchor="left"
        open={this.state.showLeftSidebar}
        onRequestClose={() => this.toggleLeftSidebar()}
        onClick={() => this.toggleLeftSidebar()}>
        <ItemList store={store} />
      </Drawer>
    );
  }

  render() {
    const userAgent= this.props.userAgent;

    return (
      <div className={classNames('Main-container', { 'show-sidebar': this.props.showSidebar })}>
        <Head>
          <title>{this.props.title}</title>
          <meta charSet="utf-8"/>
          <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
          <link rel="stylesheet" href="static/styles.css" />
        </Head>
        <AppBar className="AppBar">
          <Toolbar>
            <IconButton className="ToggleSidebar-button" color="contrast" aria-label="Menu"
              onClick={() => this.toggleLeftSidebar()}>
              <MenuIcon />
            </IconButton>
            <Typography type="title" color="inherit" className="AppTitle">
              { this.props.title }
            </Typography>
            <SearchButton store={this.props.store} />
            <IconButton color="contrast" aria-label="Connect"
              onClick={() => this.login(this.props.store)}>
              <AccountIcon />
            </IconButton>
            <IconButton title="GitHub" color="contrast"
              onClick={() => this.connect(this.props.store)} >
              <GithubIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        { this.props.showSidebar && this.renderMobileSidebar(this.props.store) }
        { this.props.showSidebar && this.renderStaticSidebar(this.props.store) }

        <div className="AppContent-container">
          { this.props.children }
        </div>

        <style jsx> {`
          :global(.AppTitle) {
            flex: 1;
          }

          @media (min-width: ${ screensizes.smallTablet }) {
            :global(.AppTitle) {
              flex: 0;
            }
          }

          @media (min-width: ${ screensizes.iPadLandscape }) {
          }
        `}</style>
      </div>
    );
  }
}
