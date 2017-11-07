import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import IconButton from 'material-ui/IconButton';
import Tooltip from 'material-ui/Tooltip';
import AddIcon from 'material-ui-icons/Add';
import EditIcon from 'material-ui-icons/Edit';
import DeleteIcon from 'material-ui-icons/Delete';
import { screensizes } from './../common/styles/screensizes.js';
import Dialog from './dialog.js';
import DialogStore from './../stores/dialog.store.js';

const Aux = props => props.children;

@observer export default class ItemContentToolbarComponent extends React.Component {
  static propTypes = {
    isInEditMode: PropTypes.bool.isRequired,
    deleteCurrentItem: PropTypes.func.isRequired,
    createNewItem: PropTypes.func.isRequired
  };

  newEntryDialogStore = new DialogStore(true);
  deleteEntryDialogStore = new DialogStore();

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
      const itemName = this.newEntryDialogStore.value;
      this.props.createNewItem(itemName);
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
      this.props.deleteCurrentItem();
    }
  }

  renderEditModeButtons() {
    return (
      <Aux>
        <Tooltip title="Add">
          <IconButton
            className="Toolbar-button"
            aria-label="Add"
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit">
          <IconButton className="Toolbar-button" aria-label="Edit">
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton className="Toolbar-button" aria-label="Delete">
            <DeleteIcon />
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
          <IconButton className="Toolbar-button" aria-label="Edit">
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
    return (
      <div className="ItemContent-toolbar">
        {this.renderNewEntryDialog()}

        {this.props.isInEditMode && this.renderEditModeButtons()}
        {!this.props.isInEditMode && this.renderNonEditModeButtons()}

        <style jsx> {`
          .ItemContent-toolbar {
            position: sticky;
            top: 0px;
            display: flex;
            justify-content: flex-end;
          }

          :global(.Toolbar-button) {
            width: 32px;
            height: 32px;
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
