import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import IconButton from 'material-ui/IconButton';
import Tooltip from 'material-ui/Tooltip';
import AddIcon from 'material-ui-icons/Add';
import EditIcon from 'material-ui-icons/Edit';
import DeleteIcon from 'material-ui-icons/Delete';
import SaveIcon from 'material-ui-icons/Save';
import CancelIcon from 'material-ui-icons/Cancel';
import { screensizes } from './../common/styles/screensizes.js';
import Dialog from './dialog.js';
import DialogStore from './../stores/dialog.store.js';

const Aux = props => props.children;

@observer export default class PageToolbarComponent extends React.Component {
  static propTypes = {
    pageStore: PropTypes.object.isRequired,
    onDeletePage: PropTypes.func.isRequired,
    onCreatePage: PropTypes.func.isRequired,
    onSavePage: PropTypes.func.isRequired,
    onBeforeSavePage: PropTypes.func.isRequired
  };

  newPageDialogStore = new DialogStore(true);
  deletePageDialogStore = new DialogStore();
  savePageDialogStore = new DialogStore(true);

  onNewPageNameKeydown(e) {
    const KEY_CODE_ENTER = 13;
    if (e.which === KEY_CODE_ENTER) {
      this.newPageDialogStore.closeDialog(true);
      this.onCreateNewPageDialogClosed();
    }
  }

  renderNewPageDialog() {
    return (
      <Dialog
        title="New wiki page"
        text="Please enter the name for the new wiki page..."
        store={this.newPageDialogStore}
        onDialogClosed={() => this.onCreateNewPageDialogClosed()}
      />
    );
  }

  onCreateNewPageDialogClosed() {
    if (this.newPageDialogStore.isConfirmed) {
      this.props.onCreatePage(this.newPageDialogStore.value);
    }
  }

  renderDeletePageDialog() {
    return (
      <Dialog
        title="Delete wiki page"
        text="Do you really want to delete the current wiki page?"
        store={this.deletePageDialogStore}
        onDialogClosed={() => this.onDeletePageDialogClosed()}
      />
    );
  }

  onDeletePageDialogClosed() {
    if (this.deletePageDialogStore.isConfirmed) {
      this.props.onDeletePage();
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

  onSavePageDialogClosed() {
    if (this.savePageDialogStore.isConfirmed) {
      this.props.onSavePage(this.savePageDialogStore.value);
    }
  }

  onEditButtonClicked() {
    this.props.pageStore.toggleEditMode();
  }

  onCancelEditButtonClicked() {
    this.props.pageStore.toggleEditMode();
  }

  onSaveButtonClicked() {
    const defaultCommitMessage = this.props.onBeforeSavePage();

    this.savePageDialogStore.openDialog(defaultCommitMessage);
  }

  renderEditModeButtons() {
    return (
      <Aux>
        {this.renderSavePageDialog()}
        <Tooltip title="Cancel">
          <IconButton
            className="Toolbar-button"
            aria-label="Cancel"
            onClick={() => this.onCancelEditButtonClicked()}
          >
            <CancelIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Save">
          <IconButton
            className="Toolbar-button"
            aria-label="Save"
            onClick={() => this.onSaveButtonClicked()}
          >
            <SaveIcon />
          </IconButton>
        </Tooltip>
      </Aux>
    );
  }

  renderNonEditModeButtons() {
    return (
      <Aux>
        {this.renderNewPageDialog()}
        {this.renderDeletePageDialog()}

        <Tooltip title="Add">
          <IconButton
            className="Toolbar-button"
            aria-label="Add"
            onClick={() => this.newPageDialogStore.openDialog('New page')}
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit">
          <IconButton
            className="Toolbar-button"
            aria-label="Edit"
            onClick={() => this.onEditButtonClicked()}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton
            className="Toolbar-button"
            aria-label="Delete"
            onClick={() => this.deletePageDialogStore.openDialog()}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Aux>
    );
  }

  render() {
    if (!this.props.pageStore) {
      return null;
    }

    return (
      <div className="Page-toolbar">
        {this.props.pageStore.isInEditMode && this.renderEditModeButtons()}
        {!this.props.pageStore.isInEditMode && this.renderNonEditModeButtons()}

        <style jsx> {`
          .Page-toolbar {
            position: fixed;
            top: 110px;
            right: 20px;
            z-index: 99;
          }

          :global(.Toolbar-button) {
            width: 32px;
            height: 32px;
            color: #005cc5;
          }

          @media (min-width: ${ screensizes.smallTablet }) {

            :global(.Toolbar-button) {
              width: 48px;
              height: 48px;
            }

            @media (min-width: ${ screensizes.iPadPortrait }) {
              .Page-toolbar {
                top: 80px;
              }
            }

          }
        `}
        </style>
      </div>
    );
  }
}
