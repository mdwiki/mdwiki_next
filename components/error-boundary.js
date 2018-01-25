import React from 'react';
import PropTypes from 'prop-types';
import Snackbar from 'material-ui/Snackbar';
import Fade from 'material-ui/transitions/Fade';

const TIMEOUT = 3000;

export default class ErrorBoundary extends React.Component {
  static propTypes = {
    children: PropTypes.any.isRequired
  };

  constructor(props) {
    super(props);
    this.state = { hasError: false };
    this._onUnhandledRejectionCallback = error => this._onUnhandledRejection(error);
  }

  componentDidMount() {
    window.addEventListener('unhandledrejection', this._onUnhandledRejectionCallback);
  }

  componentWillUnmount() {
    window.removeEventListener('unhandledrejection', this._onUnhandledRejectionCallback);
  }

  componentDidCatch(error, info) {
    this._setErrorState(error, info);
  }

  _onUnhandledRejection(error) {
    this._setErrorState(error.reason);
  }

  _setErrorState(error) {
    const hasError = Boolean(error);

    this.setState({ hasError });

    if (hasError) {
      window.setTimeout(() => {
        this.setState({ hasError: false });
      }, TIMEOUT);
    }
  }

  renderSnackBar(message) {
    return (
      <Snackbar open={this.state.hasError} message={message} transition={Fade} SnackbarContentProps={{ 'aria-describedby': 'message-id' }} />
    );
  }

  render() {
    return (
      <React.Fragment>
        { this.state.hasError && this.renderSnackBar('Unfortunately the last operation has failed, please try it again some later!') }
        { this.props.children }
      </React.Fragment>
    );
  }
}

