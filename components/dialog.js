import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import Button from 'material-ui/Button';
import Dialog, {
  DialogTitle, DialogContent, DialogActions, DialogContentText
} from 'material-ui/Dialog';
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
    const { store, onDialogClosed } = this.props;
    store.closeDialog(isConfirmed);
    if (!store.isOpened) {
      onDialogClosed();
    }
  }

  onValueInputKeydown(e) {
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
        id="dialogValueInput"
        className="DialogValue-input"
        autoFocus
        value={store.value}
        error={!store.hasValue}
        onFocus={(e) => e.target.select()}
        onKeyDown={e => this.onValueInputKeydown(e)}
        onChange={(e) => store.changeValue(e.target.value)}
      />
    );
  }

  render() {
    const { store, title, text } = this.props;
    return (
      <Dialog
        open={store.isOpened}
        transition={Transition}
        onRequestClose={() => this.onRequestClose()}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{text}</DialogContentText>
          { this.renderInputFieldIfValueIsRequired(store) }
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
            disabled={store.isValueRequired && !store.hasValue}
            onClick={() => this.onRequestClose(true)}
          >
            Ok
          </Button>
        </DialogActions>
        <style jsx>
          {`
            :global(.Dialog-button) {
              width: 150px;
              margin-bottom: 10px;
            }

            :global(.DialogValue-input) {
              margin-top: 20px;
              width: 320px;
            }
          `}
        </style>
      </Dialog>
    );
  }
}
