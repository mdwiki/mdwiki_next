import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import IconButton from 'material-ui/IconButton';
import Tooltip from 'material-ui/Tooltip';
import AddIcon from 'material-ui-icons/Add';
import EditIcon from 'material-ui-icons/Edit';
import DeleteIcon from 'material-ui-icons/Delete';
import HotKey from './hotkey.js';
import { screensizes } from './../common/styles/screensizes.js';
import Dialog from './dialog.js';
import DialogStore from './../stores/dialog.store.js';

@observer export default class PageToolbarComponent extends React.Component {
  static propTypes = {
    pageStore: PropTypes.object.isRequired,
    onCreatePage: PropTypes.func.isRequired,
    onDeletePage: PropTypes.func.isRequired,
  };

  newPageDialogStore = new DialogStore(true);
  deletePageDialogStore = new DialogStore();

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

  onEditButtonClicked() {
    this.props.pageStore.toggleEditMode();
  }

  onNewPageButtonClicked() {
    this.newPageDialogStore.openDialog('New page');
  }

  renderToolbarButtons() {
    return (
      <React.Fragment>
        {this.renderNewPageDialog()}
        {this.renderDeletePageDialog()}

        <Tooltip title="Add (Alt+N)">
          <IconButton
            className="Toolbar-button"
            aria-label="Add"
            onClick={() => this.onNewPageButtonClicked()}
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit (Shift+E)">
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
      </React.Fragment>
    );
  }

  render() {
    if (!this.props.pageStore) {
      return null;
    }

    return (
      <div className="Page-toolbar">
        {!this.props.pageStore.isInEditMode && this.renderToolbarButtons()}

        <HotKey
          keys={['alt', 'n']}
          simultaneous
          onKeysCoincide={() => this.onNewPageButtonClicked()}
        />

        <style jsx> {`
          .Page-toolbar {
            display: none;
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
                display: block;
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
