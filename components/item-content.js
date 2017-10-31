import React from 'react';
import PropTypes from 'prop-types';
import { reaction } from 'mobx';
import { observer } from 'mobx-react';
import { CircularProgress } from 'material-ui/Progress';
import github from './../services/github.service.js';
import ItemContentStore from './../stores/item-content.store.js';
import { screensizes } from './../common/styles/screensizes.js';

@observer export default class ItemContent extends React.Component {
  static propTypes = {
    appStore: PropTypes.object.isRequired,
    itemName: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
    this.itemContentStore = new ItemContentStore();
  }

  componentDidMount() {
    if (!this.itemContentStore.itemContentStore) {
      this.changeItemContent(this.props.itemName);
    }

    reaction(
      () => this.props.appStore.selectedItem,
      itemName => this.changeItemContent(itemName)
    );
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.itemName != this.props.itemName) {
      this.changeItemContent(nextProps.itemName);
    }
  }

  updateLocation(itemName) {
    if (window) {
      const location = window.location;
      const newUrl = `${location.origin}/${itemName}`;
      if (newUrl !== location.href) {
        window.history.replaceState({}, 'PageChange', newUrl);
      }
      window.ITEM_CONTENT_STORE = this.itemContentStore;
    }
  }

  changeItemContent(itemName) {
    const settings = this.props.appStore.settings;
    this.itemContentStore.changeContent(settings.user, settings.repository, itemName);
    this.updateLocation(itemName.substr(0, itemName.length -3));
  }

  renderProgress() {
    return (
      <div className="ProgressBar-container">
        <CircularProgress className="progress" size={50} />
      </div>
    );
  }

  render() {
    return (
      <div className="markdown-body">
        {this.itemContentStore.isBusy && this.renderProgress()}
        {this.itemContentStore.markdownAsReact}

        <style jsx> {`
          :global(.ProgressBar-container) {
            position: fixed;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #f5f7fa;
            opacity: 0.7;
            height: calc(100vh - 75px);
            width: calc(100vw - 20px);
          }

          :global(.progress) {
            color: #2196f3;
          }

          @media (min-width: ${ screensizes.iPadLandscape }) {
            :global(.ProgressBar-container) {
              height: calc(100vh - 90px);
              width: calc(100vw - 300px);
            }
          }
        `}</style>
      </div>
    );
  }

}

