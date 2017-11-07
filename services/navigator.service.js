import Router from 'next/router';

class NavigatorService {
  goHome() {
    return this.gotoPage('index.md');
  }

  gotoPage(itemName) {
    console.log('GotoPage', itemName);
    Router.push({ pathname: '/', query: { name: itemName } });
  }

  gotoSearchPage(searchTerm) {
    Router.push({ pathname: '/search', query: { searchTerm: escape(searchTerm) } });
  }

  gotoConnectPage() {
    Router.push('/connect');
  }

  gotoLoginPage() {
    Router.push('/login');
  }

  gotoLogoutPage() {
    Router.push('/logout');
  }
}

export default new NavigatorService();
