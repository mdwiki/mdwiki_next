import React from 'react';
import { observer } from 'mobx-react';
import Router from 'next/router';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import { initAppStore } from './../stores/app.store.js';
import ConnectStore from './../stores/connect.store.js';
import PageLayout from './../components/page-layout.js';

const DELAY_TYPE_TIMEOUT = 1000;

@observer export default class ConnectPage extends React.Component {
  static async getInitialProps({ req, query }) {
    const user = query.user;
    const repository = query.repository;

    return {
      user,
      repository
    };
  }


  typeTimeout = null;

  constructor(props) {
    super(props);
    this.appStore = initAppStore();
    this.connectStore = new ConnectStore();
  }

  componentDidMount() {
    this.connectStore.setUser(this.props.user);
    this.connectStore.setRepository(this.props.repository);
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
    this.appStore.changeSettings({ user, repository });
    Router.push('/');
  }

  render() {
    return (
      <PageLayout appStore={this.appStore} showSidebar={false}>
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
        <style jsx> {`
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

