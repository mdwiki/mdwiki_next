import React from 'react';
import { observer } from 'mobx-react';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import appStore from './../stores/app.store.js';
import ConnectStore from './../stores/connect.store.js';
import PageLayout from './../components/page-layout.js';
import navigator from './../services/navigator.service.js';

const DELAY_TYPE_TIMEOUT = 1000;

export default @observer class ConnectPage extends React.Component {
  static async getInitialProps({ req, query }) {
    const user = query.user;
    const repository = query.repository;

    return {
      user,
      repository
    };
  }

  connectStore = new ConnectStore();
  typeTimeout = null;

  componentDidMount() {
    const { user, repository } = this.props;
    this.connectStore.setUser(user);
    this.connectStore.setRepository(repository);
    this.connectStore.validate();
  }

  validate() {
    if (this.typeTimeout) {
      clearTimeout(this.typeTimeout);
    }

    this.typeTimeout = setTimeout(() => {
      this.connectStore.validate(this.connectStore.user, this.connectStore.repository);
    }, DELAY_TYPE_TIMEOUT);
  }

  onUserChanged(user) {
    this.connectStore.setUser(user);
    this.validate();
  }

  onRepositoryChanged(repository) {
    this.connectStore.setRepository(repository);
    this.validate();
  }

  connectTo(user, repository) {
    appStore.changeSettings({ user, repository });
    navigator.goHome();
  }

  render() {
    return (
      <PageLayout showSidebar={false}>
        <form className="Connect-form" autoComplete="off" noValidate>
          <TextField
            id="user"
            label="GitHub user"
            value={this.connectStore.user}
            error={!this.connectStore.userIsValid}
            onChange={(e) => this.onUserChanged(e.target.value)}
          />
          <TextField
            id="repository"
            label="GitHub repository"
            value={this.connectStore.repository}
            error={!this.connectStore.repositoryIsValid}
            onChange={(e) => this.onRepositoryChanged(e.target.value)}
          />
          <div>
            <Button
              raised
              color="primary"
              disabled={!(this.connectStore.userIsValid && this.connectStore.repositoryIsValid)}
              onClick={() => this.connectTo(this.connectStore.user, this.connectStore.repository)}
            >
              Connect
            </Button>
          </div>
        </form>
        <style jsx>
          {`
            .Connect-form {
              display: flex;
              flex-direction: column;
              width: 300px;
              padding: 10px;
            }

            .Connect-form > :global(div) {
              margin-top: 15px;
            }
          `}
        </style>
      </PageLayout>
    );
  }
}

