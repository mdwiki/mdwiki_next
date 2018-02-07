import React from 'react';
import Router from 'next/router';
import appStore from './../stores/app.store.js';

export default class LogoutPage extends React.Component {
  componentDidMount() {
    appStore.setUser();
    Router.push('/');
  }

  render() {
    return (
      <div>Logout...</div>
    );
  }
}
