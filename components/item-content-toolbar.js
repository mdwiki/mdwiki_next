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

@observer export default class ItemContentToolbarComponent extends React.Component {
  static propTypes = {
    itemContentStore: PropTypes.object.isRequired,
    deleteItem: PropTypes.func.isRequired,
    createItem: PropTypes.func.isRequired,
    saveItem: PropTypes.func.isRequired,
    beforeSaveItem: PropTypes.func.isRequired
  };

  newEntryDialogStore = new DialogStore(true);
  deleteEntryDialogStore = new DialogStore();
  saveEntryDialogStore = new DialogStore(true);

  onNewEntryNameKeydown(e) {
    const KEY_CODE_ENTER = 13;
    if (e.which === KEY_CODE_ENTER) {
      this.newEntryDialogStore.closeDialog(true);
      this.onCreateNewEntryDialogClosed();
    }
  }

  renderNewEntryDialog() {
    return (
      <Dialog
        title="New wiki page"
        text="Please enter the name for the new wiki page..."
        store={this.newEntryDialogStore}
        dialogClosed={() => this.onCreateNewEntryDialogClosed()}
      />
    );
  }

  onCreateNewEntryDialogClosed() {
    if (this.newEntryDialogStore.isConfirmed) {
      this.props.createItem(this.newEntryDialogStore.value);
    }
  }

  renderDeleteEntryDialog() {
    return (
      <Dialog
        title="Delete wiki page"
        text="Do you really want to delete the current wiki page?"
        store={this.deleteEntryDialogStore}
        dialogClosed={() => this.onDeleteEntryDialogClosed()}
      />
    );
  }

  onDeleteEntryDialogClosed() {
    if (this.deleteEntryDialogStore.isConfirmed) {
      this.props.deleteItem();
    }
  }

  renderSaveEntryDialog() {
    return (
      <Dialog
        title="Save changes"
        text="Please enter a commit message for your changes"
        store={this.saveEntryDialogStore}
        dialogClosed={() => this.onSaveEntryDialogClosed()}
      />
    );
  }

  onSaveEntryDialogClosed() {
    if (this.saveEntryDialogStore.isConfirmed) {
      this.props.saveItem(this.saveEntryDialogStore.value);
    }
  }

  onEditButtonClicked() {
    this.props.itemContentStore.toggleEditMode();
  }

  onCancelEditButtonClicked() {
    this.props.itemContentStore.toggleEditMode();
  }

  onSaveButtonClicked() {
    const defaultCommitMessage = this.props.beforeSaveItem();

    this.saveEntryDialogStore.openDialog(defaultCommitMessage);
  }

  renderEditModeButtons() {
    return (
      <Aux>
        {this.renderSaveEntryDialog()}
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
        {this.renderNewEntryDialog()}
        {this.renderDeleteEntryDialog()}

        <Tooltip title="Add">
          <IconButton
            className="Toolbar-button"
            aria-label="Add"
            onClick={() => this.newEntryDialogStore.openDialog('New page')}
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
            onClick={() => this.deleteEntryDialogStore.openDialog()}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Aux>
    );
  }

  render() {
    if (!this.props.itemContentStore) {
      return null;
    }

    return (
      <div className="ItemContent-toolbar">
        {this.props.itemContentStore.isInEditMode && this.renderEditModeButtons()}
        {!this.props.itemContentStore.isInEditMode && this.renderNonEditModeButtons()}

        <style jsx> {`
          .ItemContent-toolbar {
            position: fixed;
            top: 80px;
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
          }
        `}
        </style>
      </div>
    );
  }
}
