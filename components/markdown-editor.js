import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import SimpleMDE from 'react-simplemde-editor';
import HotKey from 'react-shortcut';
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

const Aux = props => props.children;

@observer export default class MarkdownEditorComponent extends React.Component {
  static propTypes = {
    pageStore: PropTypes.object.isRequired,
    onSavePage: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    const myButtons = [{
      name: 'save', action: () => this.onSaveButtonClicked(), className: 'fa fa-floppy-o', title: 'Save'
    }, {
      name: 'cancel', action: () => this.onCancelEditButtonClicked(), className: 'fa fa-times', title: 'Cancel'
    }];
    SimpleMDEOptions.toolbar = myButtons.concat(SimpleMDEOptions.toolbar);

    this.savePageDialogStore = new DialogStore(true);
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
      defaultCommitMessage = `Some changes for ${this.props.pageStore.page.name}`;
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
      <Aux>
        { this.renderSavePageDialog() }
        <SimpleMDE
          ref={simpleMDE => this.simpleMDE = simpleMDE ? simpleMDE.simplemde : undefined} // eslint-disable-line
          onChange={markdownText => pageStore.updatePage(markdownText)}
          value={pageStore.markdownText}
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
          keys={['shift', 's']}
          simultaneous
          onKeysCoincide={() => this.onSaveButtonClicked()}
        />

        <HotKey
          keys={['escape']}
          simultaneous
          onKeysCoincide={() => this.onCancelEditButtonClicked()}
        />
      </Aux>
    );
  }
}
