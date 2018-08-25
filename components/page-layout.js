import React from 'react';
import PropTypes from 'prop-types';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import AccountIcon from 'material-ui-icons/AccountCircle';
import Drawer from 'material-ui/Drawer';
import classNames from 'classnames';

import ErrorBoundary from './error-boundary.js';
import GithubIcon from './github-icon.js';
import SearchButton from './search-button.js';
import UserIcon from './user-icon.js';
import PageList from './page-list.js';
import navigator from './../services/navigator.service.js';
import appStore from './../stores/app.store.js';

import { screensizes } from './../common/styles/screensizes.js';

export default class PageLayout extends React.Component {
  static propTypes = {
    children: PropTypes.any.isRequired,
    showSidebar: PropTypes.bool
  };

  static defaultProps = {
    showSidebar: true
  };


  state = {
    showLeftSidebar: false,
    isLoaded: false
  };

  toggleLeftSidebar() {
    const { showLeftSidebar } = this.state;
    this.setState({ showLeftSidebar: !showLeftSidebar });
  }

  componentDidMount() {
    this.setState({ isLoaded: true }); // eslint-disable-line
  }

  connect() {
    const { user, repository } = appStore.settings;
    navigator.gotoConnectPage(user, repository);
  }

  login() {
    navigator.gotoLoginPage();
  }

  logout() {
    navigator.gotoLogoutPage();
  }

  goHome() {
    navigator.goHome();
  }

  renderStaticSidebar() {
    return (
      <div className="Sidebar">
        <PageList />
      </div>
    );
  }

  renderMobileSidebar() {
    const { showLeftSidebar } = this.state;
    return (
      <Drawer
        className="LeftSidebar"
        type="temporary"
        anchor="left"
        open={showLeftSidebar}
        onRequestClose={() => this.toggleLeftSidebar()}
        onClick={() => this.toggleLeftSidebar()}
      >
        <PageList />
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
    const user = appStore.user || {};

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
    return appStore.user && appStore.user.isLoggedIn;
  }

  render() {
    const { showSidebar, children } = this.props;
    const { isLoaded } = this.state;

    const mainContainerClassName = classNames(
      'Main-container',
      { 'show-sidebar': showSidebar },
      { 'is-loaded': isLoaded }
    );

    return (
      <div className={mainContainerClassName}>
        <ErrorBoundary>
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
                <button type="button" className="Logo-button" onClick={() => this.goHome()}>
                  <img className="Logo-image" src="static/images/wiki.png" alt="MDWiki" />
                </button>
              </div>
              <SearchButton />
              <IconButton
                title="Connect to a Github repository"
                color="contrast"
                aria-label="Connect"
                onClick={() => this.connect()}
              >
                <GithubIcon />
              </IconButton>
              {!this.isUserLoggedIn() && this.renderLoginButton()}
              {this.isUserLoggedIn() && this.renderLogoutButton()}
            </Toolbar>
          </AppBar>

          { showSidebar && this.renderMobileSidebar(appStore) }
          { showSidebar && this.renderStaticSidebar(appStore) }

          <div className="AppContent-container">
            { children }
          </div>
        </ErrorBoundary>

        <style jsx>
          {`
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
