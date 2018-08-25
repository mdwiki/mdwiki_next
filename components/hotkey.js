import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import difference from 'lodash/difference';
import isEqual from 'lodash/isEqual';

export default class HotKey extends React.Component {
  static propTypes = {
    keys: PropTypes.array.isRequired,
    simultaneous: PropTypes.bool,
    onKeysCoincide: PropTypes.func.isRequired
  };

  static defaultProps = {
    simultaneous: false
  };

  constructor(props) {
    super(props);

    this.state = {
      buffer: [],
      eventsBuffer: [],
    };

    this.onKeyPress = this.onKeyPress.bind(this);
  }

  componentDidMount() {
    window.document.addEventListener('keydown', this.onKeyPress);
  }

  componentWillUnmount() {
    window.document.removeEventListener('keydown', this.onKeyPress);
  }

  onKeyPress(e) {
    const { keys, onKeysCoincide, simultaneous } = this.props;
    const { buffer, eventsBuffer } = this.state;

    const key = (e && e.key && e.key.toLowerCase()) || null;

    const maxLength = keys.length;

    let newBuffer = [];
    let newEventsBuffer = [];

    if (key) {
      if (buffer.length >= maxLength) {
        newBuffer = buffer.slice(1).concat(key);
        newEventsBuffer = eventsBuffer.slice(1).concat(e);
      } else {
        newBuffer = buffer.concat(key);
        newEventsBuffer = eventsBuffer.concat(e);
      }
    }

    const isKeySetEmpty = !maxLength || (maxLength === 0);
    const areKeysPressedTogether = simultaneous && isEmpty(difference(keys, newBuffer));
    const areKeysPressedSequently = !simultaneous && isEqual(keys, newBuffer);

    if (!isKeySetEmpty) {
      if (areKeysPressedTogether || areKeysPressedSequently) {
        onKeysCoincide(newBuffer, newEventsBuffer);
        this.setState({
          buffer: [],
          eventsBuffer: []
        });
      } else {
        this.setState({
          buffer: newBuffer,
          eventsBuffer: newEventsBuffer
        });
      }
    }
  }

  render() {
    return (<span />);
  }
}
