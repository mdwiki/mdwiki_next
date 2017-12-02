class EnvService {
  isServer() {
    return typeof window === 'undefined';
  }

  isClient() {
    return !this.isServer();
  }

  host() {
    if (this.isClient()) {
      return `${window.location.protocol}//${window.location.host}`;
    }
    return '';
  }
}

export default new EnvService();
