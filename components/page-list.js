import React from 'react';
import { observer } from 'mobx-react';
import List, { ListItem, ListItemText, ListSubheader } from 'material-ui/List';
import Scrollchor from 'react-scrollchor';
import groupPages from './../common/helpers/page-grouper.js';
import appStore from './../stores/app.store.js';
import navigator from './../services/navigator.service.js';
import { screensizes } from './../common/styles/screensizes.js';

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

  renderGroupLink(group) {
    return (
      <Scrollchor className="Group-link" to={`#${group.letter}`}>
        {group.letter}
        <style jsx> {`
          :global(.Group-link) {
            font-size: 1.5rem;
            color: rgba(0, 0, 0, 0.54);
            text-decoration: none
          }

          :global(.Group-link:hover) {
            color: black;
          }
        `}
        </style>
      </Scrollchor>
    );
  }

  renderGroup(group) {
    return (
      <div key={group.letter}>
        <ListSubheader className="PageSubHeader">
          <section id={group.letter} href="#">{group.letter}</section>
        </ListSubheader>
        { group.pages.map(page => this.renderPage(page))}
        <style jsx> {`
          section {
            margin: 0;
            font-size: 1em;;
          }
        `}
        </style>
      </div>
    );
  }

  render() {
    if (!appStore.pages) {
      return null;
    }

    const groups = groupPages(appStore.pages);
    const groupsPerRow = groups.length > 10 ? Math.ceil(groups.length / 2) : groups.length;

    return (
      <div className="Sidebar-container">
        <div className="GroupLinks-container">
          {groups.map(group => this.renderGroupLink(group))}
        </div>
        <div className="PageList-container">
          <List className="Page-list">
            {groups.map(group => this.renderGroup(group))}
          </List>
        </div>
        <style jsx> {`
          :global(.PageNameText) {
            margin-left: 10px;
          }

          :global(.PageSubHeader) {
            font-weight: bold;
            font-size: 18px;
          }

          :global(.Page-list) {
            padding-top: 0px;
          }

          .Sidebar-container {
            width: 100%;
          }

          .PageList-container {
            overflow-y: auto;
            overflow-x: hidden;
            height: 100vh;
          }

          .GroupLinks-container {
            display: none;
          }

          @media (min-width: ${ screensizes.iPadLandscape }) {
            .GroupLinks-container {
              display: grid;
              grid-template-columns: repeat(${groupsPerRow}, 20px);
              justify-content: center;
              margin: 5px 5px 0px 5px;
            }

            .PageList-container {
              height: calc(100vh - 120px);
            }
          }
        `}
        </style>
      </div>
    );
  }
}
