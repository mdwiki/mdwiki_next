const EXCLUDE_PAGES = ['index', 'readme'];

export default function filterPage(page) {
  const pageName = page.name.toLowerCase();
  return !EXCLUDE_PAGES.some(name => pageName === name);
}
