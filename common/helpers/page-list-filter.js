const EXCLUDE_PAGES = ['index.md', 'readme.md'];

export default function filterPage(page) {
  const pageName = page.name.toLowerCase();
  if (EXCLUDE_PAGES.some(name => pageName === name)) {
    return false;
  }
  return pageName.endsWith('.md');
}
