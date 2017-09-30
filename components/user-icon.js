import React from 'react';
import PropTypes from 'prop-types';

const UserIcon = ({ userName, avatarUrl }) => (
  <div>
    <img src={avatarUrl} alt={userName} />
    <style jsx> {`
      img {
        height: 30px;
        width: 30px;
        border-radius: 15px;
        transform: translateY(4px);
      }
    `}</style>
  </div>
);

UserIcon.propTypes = {
  userName: PropTypes.string.isRequired,
  avatarUrl: PropTypes.string.isRequired
};

export default UserIcon;
