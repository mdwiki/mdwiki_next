import React from 'react';
import { CircularProgress } from 'material-ui/Progress';
import { screensizes } from './../common/styles/screensizes.js';

const ProgressBar = () => (
  <div className="ProgressBar-container">
    <CircularProgress className="progress" size={50} />
    <style jsx>
      {`
        .ProgressBar-container {
          position: fixed;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #f5f7fa;
          opacity: 0.7;
          height: calc(100vh - 75px);
          width: calc(100vw - 17px);
        }

        @media (min-width: ${ screensizes.iPadLandscape }) {
          .ProgressBar-container {
            width: calc(100vw - 310px);
          }
        }

        :global(.progress) {
          color: #2196f3;
        }
      `}
    </style>
  </div>
);

export default ProgressBar;
