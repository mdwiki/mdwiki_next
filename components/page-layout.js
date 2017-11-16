import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Router from 'next/router';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import AccountIcon from 'material-ui-icons/AccountCircle';
import Drawer from 'material-ui/Drawer';
import classNames from 'classnames';

import GithubIcon from './github-icon.js';
import SearchButton from './search-button.js';
import UserIcon from './user-icon.js';
import ItemList from './item-list.js';
import { screensizes } from './../common/styles/screensizes.js';

export default class PageLayout extends React.Component {
  static propTypes = {
    children: PropTypes.any.isRequired,
    appStore: PropTypes.object.isRequired,
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

  toggleLeftSidebar() {
    const showLeftSidebar = this.state.showLeftSidebar;
    this.setState({ showLeftSidebar: !showLeftSidebar });
  }

  connect(appStore) {
    Router.push({
      pathname: '/connect',
      query: { user: appStore.settings.user, repository: appStore.settings.repository }
    });
  }

  login() {
    Router.push('/login');
  }

  logout() {
    Router.push('/logout');
  }

  goHome() {
    Router.push({ pathname: '/', query: { itemName: 'index.md' } });
    this.props.appStore.selectedItem = 'index.md';
  }

  renderStaticSidebar(appStore) {
    return (
      <div className="Sidebar">
        <ItemList appStore={appStore} />
      </div>
    );
  }

  renderMobileSidebar(appStore) {
    return (
      <Drawer
        className="LeftSidebar"
        type="temporary"
        anchor="left"
        open={this.state.showLeftSidebar}
        onRequestClose={() => this.toggleLeftSidebar()}
        onClick={() => this.toggleLeftSidebar()}
      >
        <ItemList appStore={appStore} />
      </Drawer>
    );
  }

  renderLoginButton() {
    return (
      <IconButton
        title="Login" color="contrast" aria-label="Login"
        onClick={() => this.login()}
      >
        <AccountIcon />
      </IconButton>
    );
  }

  renderLogoutButton() {
    const user = this.props.appStore.user || {};

    return (
      <IconButton
        title={`Logout ${user.name}`}
        color="contrast"
        aria-label="Logout"
        onClick={() => this.logout()}
      >
        <UserIcon userName={user.name} avatarUrl={user.avatarUrl} />
      </IconButton>
    );
  }

  isUserLoggedIn() {
    return this.props.appStore.user && this.props.appStore.user.isLoggedIn;
  }

  render() {
    return (
      <div className={classNames('Main-container', { 'show-sidebar': this.props.showSidebar })}>
        <Head>
          <title>{this.props.title}</title>
          <meta charSet="utf-8" />
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
          <link rel="stylesheet" href="static/styles/simplemde.min.css" />
          <link rel="stylesheet" href="static/styles/markdown.css" />
          <link rel="stylesheet" href="static/styles/styles.css" />
          <link rel="shortcut icon" href="static/images/favicon.ico" type="image/x-icon" />
        </Head>
        <AppBar className="AppBar">
          <Toolbar className="Toolbar">
            <IconButton
              className="ToggleSidebar-button"
              color="contrast"
              aria-label="Menu"
              onClick={() => this.toggleLeftSidebar()}
            >
              <MenuIcon />
            </IconButton>
            <div className="AppTitle">
              <button className="Logo-button" onClick={() => this.goHome()}>
                <img className="Logo-image" src="static/images/wiki.png" alt="MDWiki" />
              </button>
            </div>
            <SearchButton appStore={this.props.appStore} />
            <IconButton
              title="Connect to a Github repository"
              color="contrast"
              aria-label="Connect"
              onClick={() => this.connect(this.props.appStore)}
            >
              <GithubIcon />
            </IconButton>
            {!this.isUserLoggedIn() && this.renderLoginButton()}
            {this.isUserLoggedIn() && this.renderLogoutButton()}
          </Toolbar>
        </AppBar>

        { this.props.showSidebar && this.renderMobileSidebar(this.props.appStore) }
        { this.props.showSidebar && this.renderStaticSidebar(this.props.appStore) }

        <div className="AppContent-container">
          { this.props.children }
        </div>

        <style jsx> {`
          :global(.AppTitle) {
            flex: 1;
          }

          :global(.AppTitle > a){
            text-decoration: none;
            color: inherit;
          }

          :global(.Toolbar) {
            padding-left: 0px !important;
          }

          .Logo-image {
            height: 48px;
            width: 48px;
            cursor: pointer;
          }

          .Logo-button {
            background: none;
            border: none;
          }

          .Logo-button:focus {
            outline: none;
          }

          @media (min-width: ${ screensizes.smallTablet }) {
            :global(.AppTitle) {
              flex: 0;
            }
          }

          @media (min-width: ${ screensizes.iPadLandscape }) {
            :global(.Toolbar) {
              padding-left: 16px !important;
            }
          }
        `}
        </style>
      </div>
    );
  }
}
