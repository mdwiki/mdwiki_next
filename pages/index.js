import React from 'react';
import { initStore } from './../store/store.js';
import { observer } from 'mobx-react';

@observer export default class IndexPage extends React.Component {
  static async getInitialProps({ req }) {
    const isServer = !!req;
    const store = initStore(isServer);
    return { lastUpdate: store.lastUpdate, isServer };
  }

  constructor(props) {
    super(props);
    this.store = initStore(props.isServer, props.lastUpdate);
  }

  onButtonClick(event) {
    console.log('clicked on the button', event);
    this.store.update();
    this.store.start();
  }

  render() {
    return (
      <div>
        <p>Last updated: { this.store.lastUpdate }</p>
        <button onClick={() => this.onButtonClick()}>Update</button>
      </div>

    );
  }
}
