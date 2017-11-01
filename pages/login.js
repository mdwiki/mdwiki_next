import React from 'react';
import Router from 'next/router';
import { initAppStore } from './../stores/app.store.js';
import github from './../services/github.service.js';

export default class LoginPage extends React.Component {
  static async getInitialProps({ query }) {
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
      this.appStore = initAppStore(user);

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
