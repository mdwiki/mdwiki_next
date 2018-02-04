import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import List, { ListItem, ListItemText, ListSubheader } from 'material-ui/List';
import groupPages from './../common/helpers/page-grouper.js';
import navigationService from './../services/navigator.service.js';

@observer export default class PageList extends React.Component {
  static propTypes = {
    appStore: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.loadPages(this.props.appStore);
  }

  componentWillReceiveProps(nextProps) {
    this.loadPages(nextProps.appStore);
  }

  loadPages(appStore) {
    return appStore.loadPages();
  }

  onPageClicked(page) {
    navigationService.gotoPage(page.name);
    this.props.appStore.changeSelectedPage(page.name);
  }

  renderPage(page) {
    return (
      <ListItem button key={page.name}>
        <ListItemText
          className="PageNameText"
          primary={page.name}
          onClick={() => this.onPageClicked(page)}
        />
      </ListItem>
    );
  }

  renderGroup(group) {
    return (
      <div key={group.letter}>
        <ListSubheader className="PageSubHeader" key={group.letter}>{group.letter}</ListSubheader>
        { group.pages.map(page => this.renderPage(page))}
      </div>
    );
  }

  render() {
    const appStore = this.props.appStore;
    if (!appStore.pages) {
      return null;
    }

    const groups = groupPages(appStore.pages);

    return (
      <List>
        {groups.map(group => this.renderGroup(group))}
        <style jsx> {`
          :global(.PageNameText) {
            margin-left: 10px;
          }

          :global(.PageSubHeader) {
            font-weight: bold;
            font-size: 18px;
          }
        `}
        </style>
      </List>
    );
  }
}
