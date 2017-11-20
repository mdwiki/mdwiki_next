import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import Button from 'material-ui/Button';
import Dialog, { DialogTitle, DialogContent, DialogActions, DialogContentText } from 'material-ui/Dialog';
import Slide from 'material-ui/transitions/Slide';
import TextField from 'material-ui/TextField';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

@observer export default class DialogComponent extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    store: PropTypes.object.isRequired,
    onDialogClosed: PropTypes.func.isRequired
  };

  onRequestClose(isConfirmed = false) {
    this.props.store.closeDialog(isConfirmed);
    if (!this.props.store.isOpened) {
      this.props.onDialogClosed();
    }
  }

  onNewEntryNameKeydown(e) {
    const KEY_CODE_ENTER = 13;
    if (e.which === KEY_CODE_ENTER) {
      this.onRequestClose(true);
    }
  }

  renderInputFieldIfValueIsRequired(store) {
    if (!store.isValueRequired) {
      return null;
    }

    return (
      <TextField
        id="newEntryNameInput"
        className="NewEntryName-input"
        value={store.value}
        error={!store.hasValue}
        onFocus={(e) => e.target.select()}
        onKeyDown={e => this.onNewEntryNameKeydown(e)}
        onChange={(e) => store.changeValue(e.target.value)}
      />
    );
  }

  render() {
    return (
      <Dialog
        open={this.props.store.isOpened}
        transition={Transition}
        onRequestClose={() => this.onRequestClose()}
      >
        <DialogTitle>{this.props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{this.props.text}</DialogContentText>
          { this.renderInputFieldIfValueIsRequired(this.props.store) }
        </DialogContent>
        <DialogActions>
          <Button
            className="Dialog-button" raised
            onClick={() => this.onRequestClose()}
          >
            Cancel
          </Button>
          <Button
            className="Dialog-button" raised color="primary"
            disabled={this.props.store.isValueRequired && !this.props.store.hasValue}
            onClick={() => this.onRequestClose(true)}
          >
            Ok
          </Button>
        </DialogActions>
        <style jsx> {`
          :global(.Dialog-button) {
            width: 150px;
            margin-bottom: 10px;
          }

          :global(.NewEntryName-input) {
            margin-top: 20px;
            width: 320px;
          }
        `}
        </style>
      </Dialog>
    );
  }
}
