import React from 'react';
import http from './../services/http.service.js';
import { initStore } from './../stores/store.js';
import Router from 'next/router';
import github from './../services/github.service.js';

export default class LoginPage extends React.Component {
  static async getInitialProps({ req, query }) {
    const isServer = !!req;
    const user = query.user;
    const accessToken = query.accessToken;

    return { user, accessToken };
  }

  async readUserAvatarUrl(userName, accessToken) {
    const user = await github.getUser(userName, accessToken);
    return user.avatar_url;
  }

  async componentDidMount() {
    const user = {
      isLoggedIn: this.props.user !== undefined,
      name: this.props.user,
      accessToken: this.props.accessToken
    };

    if (user.isLoggedIn) {
      user.avatarUrl = await this.readUserAvatarUrl(user.name, user.accessToken);
      this.store = initStore(user);

      Router.push('/');
    } else {
      window.location = '/auth/github';
    }
  }

  render() {
    return (
      <div>Please wait, we redirect you to GitHub...</div>
    );
  }
}
