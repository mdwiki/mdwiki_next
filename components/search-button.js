import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import Router from 'next/router';
import IconButton from 'material-ui/IconButton';
import SearchIcon from 'material-ui-icons/Search';

@observer export default class SearchButton extends React.Component {
  static propTypes = {
    appStore: PropTypes.object.isRequired
  };

  onSearchClicked() {
    Router.push({
      pathname: '/search',
      query: { searchTerm: this.props.appStore.searchTerm }
    });
  }

  changeSearchTerm(searchTerm) {
    this.props.appStore.changeSearchTerm(searchTerm);
  }

  onInputKeydown(e) {
    const KEY_CODE_ENTER = 13;
    if (e.which === KEY_CODE_ENTER) {
      this.onSearchClicked();
    }
  }

  render() {
    return (
      <div className="Search-wrapper">
        <IconButton className="Search-button" color="contrast"
          onClick={() => this.onSearchClicked()} >
          <SearchIcon />
        </IconButton>
        <input placeholder="Search..."
          value={this.props.appStore.searchTerm}
          onChange={e => this.changeSearchTerm(e.target.value) }
          onKeyDown={e => this.onInputKeydown(e) } />

        <style jsx> {`
          input {
            display: none;
          }

          @media (min-width: 510px) {
            .Search-wrapper {
              border-radius: 2px;
              background-color: rgba(255,255,255,.15);
              margin: 0 15px;
              padding: 10px;
              display: flex;
              justify-content: space-between;
              flex: 1;
            }

            .Search-wrapper:hover {
              background-color: rgba(255,255,255,.25);
              outline: 1px solid transparent;
            }

            :global(button.Search-button) {
              height: 24px !important;
            }

            input {
              font: inherit;
              padding: 5px;
              border: 0;
              display: block;
              verticalAlign: middle;
              whiteSpace: normal;
              background: none;
              margin: 0; // Reset for Safari
              color: inherit;
              flex: 1
            }

            input:focus {
              outline: 0;
            }

            input::placeholder {
              color: white;
            }
          }

        `}</style>
      </div>

    );
  }
}
