import React from 'react';
import Router from 'next/router';
import { initAppStore } from './../stores/app.store.js';

export default class LogoutPage extends React.Component {
  componentDidMount() {
    initAppStore({ isLoggedIn: false });
    Router.push('/');
  }

  render() {
    return (
      <div>Logout...</div>
    );
  }
}
