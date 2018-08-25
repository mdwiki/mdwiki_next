import React from 'react';
import PropTypes from 'prop-types';

const HotKey = ({ keys, simultaneous, onKeysCoincide }) => (
  <div />
);

HotKey.propTypes = {
  keys: PropTypes.array.isRequired,
  simultaneous: PropTypes.bool,
  onKeysCoincide: PropTypes.func.isRequired
};

HotKey.defaultProps = {
  simultaneous: false
};

export default HotKey;
