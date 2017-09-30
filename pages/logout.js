import React from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import { initStore } from './../stores/store.js';

export default class LogoutPage extends React.Component {
  componentDidMount() {
    initStore({ isLoggedIn: false });
    Router.push('/');
  }

  render() {
    return (
      <div>Logout...</div>
    );
  }
}
