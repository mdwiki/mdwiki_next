import Router from 'next/router';

class NavigatorService {
  goHome() {
    return this.gotoPage('index');
  }

  gotoPage(pageName) {
    Router.push({ pathname: '/', query: { page: pageName } });
  }

  gotoSearchPage(searchTerm) {
    Router.push({ pathname: '/search', query: { searchTerm: escape(searchTerm) } });
  }

  gotoConnectPage(user, repository) {
    Router.push({
      pathname: '/connect',
      query: { user, repository }
    });
  }

  gotoLoginPage() {
    Router.push('/login');
  }

  gotoLogoutPage() {
    Router.push('/logout');
  }
}

export default new NavigatorService();
