import React from 'react';
import appStore from './../stores/app.store.js';
import github from './../services/github.service.js';
import navigator from './../services/navigator.service.js';

export default class LoginPage extends React.Component {
  static async getInitialProps({ query }) {
    const userName = query.user;
    const accessToken = query.accessToken;

    return { userName, accessToken };
  }

  async readUserAvatarUrl(userName, accessToken) {
    const user = await github.getUser(userName, accessToken);
    return user.avatar_url;
  }

  async componentDidMount() {
    const { userName, accessToken } = this.props;
    const user = {
      isLoggedIn: userName !== undefined,
      name: userName,
      accessToken
    };

    if (user.isLoggedIn) {
      user.avatarUrl = await this.readUserAvatarUrl(user.name, user.accessToken);
      appStore.setUser(user);

      navigator.goHome();
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
