import { action, observable } from 'mobx';

export default class DialogStore {
  @observable isOpened = false;
  @observable value = '';
  @observable hasValue = false;
  isConfirmed = false;

  constructor(isValueRequired = false) {
    this.isValueRequired = isValueRequired;
  }

  @action openDialog(defaultValue = '') {
    this.isOpened = true;
    this.changeValue(defaultValue);
  }

  @action closeDialog(isConfirmed = false) {
    if (isConfirmed &&
      this.isValueRequired &&
      !this.hasValue) {
      return;
    }

    this.isConfirmed = isConfirmed;
    this.isOpened = false;
  }

  @action changeValue(newValue) {
    this.value = newValue;
    this.hasValue = this.value.length > 0;
  }
}
