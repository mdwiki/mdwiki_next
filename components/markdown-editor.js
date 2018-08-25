import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import SimpleMDE from 'react-simplemde-editor';
import HotKey from './hotkey.js';
import Dialog from './dialog.js';
import DialogStore from './../stores/dialog.store.js';

const SimpleMDEOptions = {
  spellChecker: false,
  status: false,
  previewRender: false,
  autofocus: true,
  toolbar: [
    '|',
    'bold',
    'italic',
    'strikethrough',
    'heading',
    '|',
    'horizontal-rule',
    'quote',
    'unordered-list',
    'ordered-list',
    '|',
    'link',
    'image',
    'code',
    '|',
    'preview',
    'guide',
  ]
};

@observer export default class MarkdownEditorComponent extends React.Component {
  static propTypes = {
    pageStore: PropTypes.object.isRequired,
    onSavePage: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this._prependCustomButtonsToToolbar();

    this.savePageDialogStore = new DialogStore(true);
  }

  _prependCustomButtonsToToolbar() {
    const defaultToolbar = [...SimpleMDEOptions.toolbar];
    if (defaultToolbar[0].name === 'save') { // We've to remove the buttons before we can add it again
      defaultToolbar.splice(0, 2);
    }

    const myButtons = [{
      name: 'save', action: () => this.onSaveButtonClicked(), className: 'fa fa-floppy-o', title: 'Save (Alt+S)'
    }, {
      name: 'cancel', action: () => this.onCancelEditButtonClicked(), className: 'fa fa-times', title: 'Cancel (ESC)'
    }];

    SimpleMDEOptions.toolbar = [...myButtons, ...defaultToolbar];
  }

  onCancelEditButtonClicked() {
    if (this.savePageDialogStore.isOpened) {
      return;
    }
    this.props.pageStore.toggleEditMode();
  }

  onSaveButtonClicked() {
    let defaultCommitMessage;

    if (this.simpleMDE) {
      defaultCommitMessage = this.simpleMDE.codemirror.getSelection();
    }

    if (!defaultCommitMessage) {
      const pageName = this.props.pageStore.page.name;
      defaultCommitMessage = `Some changes for ${pageName}`;
    }

    this.savePageDialogStore.openDialog(defaultCommitMessage);
  }

  onSavePageDialogClosed() {
    if (this.savePageDialogStore.isConfirmed) {
      this.props.onSavePage(this.savePageDialogStore.value);
    }
  }

  renderSavePageDialog() {
    return (
      <Dialog
        title="Save changes"
        text="Please enter a commit message for your changes"
        store={this.savePageDialogStore}
        onDialogClosed={() => this.onSavePageDialogClosed()}
      />
    );
  }

  render() {
    const pageStore = this.props.pageStore;

    return (
      <React.Fragment>
        { this.renderSavePageDialog() }
        <SimpleMDE
          ref={simpleMDE => this.simpleMDE = simpleMDE ? simpleMDE.simplemde : undefined} // eslint-disable-line
          onChange={markdown => pageStore.updatePage(markdown)}
          value={pageStore.markdown}
          options={SimpleMDEOptions}
        >
          <style jsx> {`
            :global(.CodeMirror-scroll) {
              height: calc(100vh - 160px);
            }
          `}
          </style>
        </SimpleMDE>

        <HotKey
          keys={['alt', 's']}
          simultaneous
          onKeysCoincide={() => this.onSaveButtonClicked()}
        />

        <HotKey
          keys={['escape']}
          simultaneous
          onKeysCoincide={() => this.onCancelEditButtonClicked()}
        />
      </React.Fragment>
    );
  }
}
