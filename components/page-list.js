import React from 'react';
import { observer } from 'mobx-react';
import List, { ListItem, ListItemText, ListSubheader } from 'material-ui/List';
import groupPages from './../common/helpers/page-grouper.js';
import appStore from './../stores/app.store.js';
import navigator from './../services/navigator.service.js';

@observer export default class PageList extends React.Component {
  componentDidMount() {
    this.loadPages();
  }

  loadPages() {
    return appStore.loadPages();
  }

  onPageClicked(page) {
    navigator.gotoPage(page.name);
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
