import env from './env.service';

export async function getConfig() {
  const isClient = !env.isServer();
  if (isClient && window.CLIENT_CONFIG) {
    return window.CLIENT_CONFIG;
  }

  const response = await fetch('/config');
  const config = response.json();

  if (isClient) {
    window.CLIENT_CONFIG = config;
  }
  return config;
}
