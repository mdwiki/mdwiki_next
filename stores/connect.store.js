import { action, observable } from 'mobx';
import github from './../services/github.service.js';

class ConnectStore {
  @observable user = '';
  @observable repository = '';
  @observable userIsValid = false;
  @observable repositoryIsValid = false;

  constructor(accessToken) {
    this.accessToken = accessToken;
  }

  @action async setUser(user) {
    this.user = user;
  }

  @action async setRepository(repository) {
    this.repository = repository;
  }

  @action async validate() {
    this.userIsValid = await this.validateUser(this.user);
    if (this.userIsValid) {
      this.repositoryIsValid = await this.validateRepository(this.user, this.repository);
    } else {
      this.repositoryIsValid = false;
    }
  }

  async validateUser(userName) {
    const user = await github.getUser(userName, this.accessToken);
    return user !== undefined;
  }

  async validateRepository(userName, repositoryName) {
    const repository = await github.getRepository(userName, repositoryName, this.accessToken);
    return repository !== undefined;
  }
}

export default ConnectStore;

